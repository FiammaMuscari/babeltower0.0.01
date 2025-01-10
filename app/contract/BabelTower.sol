// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BabelTower is Ownable, ReentrancyGuard {
    IERC20 public wldToken;
    
    struct Floor {
        uint256 level;
        bool isLocked;
        uint256 workers;
        uint256 lastCollected;
        uint256 generationRate;
    }
    
    struct Player {
        uint256 totalGems;
        uint256 lastUpdate;
        mapping(uint256 => Floor) floors;
        uint256 highestFloor;
    }
    
    mapping(address => Player) public players;
    
    // Game constants matching frontend config
    uint256 constant BASE_WORKER_COST = 5;
    uint256 constant BASE_EXPANSION_COST = 25;
    uint256 constant BASE_GEM_GENERATION = 1;
    uint256 constant BASE_WORKER_PRODUCTION = 2;
    uint256 constant FLOOR_PRODUCTION_MULTIPLIER = 150; // 1.5 * 100
    uint256 constant WORKER_PRODUCTION_MULTIPLIER = 130; // 1.3 * 100
    uint256 constant WORKER_COST_MULTIPLIER = 120; // 1.2 * 100
    uint256 constant WORKER_COUNT_COST_MULTIPLIER = 180; // 1.8 * 100
    uint256 constant EXPANSION_COST_MULTIPLIER = 150; // 1.5 * 100
    uint256 constant MAX_WORKERS_PER_FLOOR = 100;
    uint256 constant INITIAL_GEMS = 50;
    
    event FloorUnlocked(address indexed player, uint256 level);
    event WorkerAdded(address indexed player, uint256 floorLevel, uint256 workerCount);
    event GemsCollected(address indexed player, uint256 amount);
    event RewardClaimed(address indexed player, uint256 wldAmount);
    
    constructor(address _wldToken) Ownable(msg.sender) {
        wldToken = IERC20(_wldToken);
    }
    
    function initializePlayer() external {
        require(players[msg.sender].highestFloor == 0, "Player already initialized");
        
        Player storage player = players[msg.sender];
        player.totalGems = INITIAL_GEMS;
        player.lastUpdate = block.timestamp;
        player.highestFloor = 1;
        
        Floor storage firstFloor = player.floors[1];
        firstFloor.level = 1;
        firstFloor.isLocked = false;
        firstFloor.workers = 0;
        firstFloor.lastCollected = block.timestamp;
        firstFloor.generationRate = BASE_GEM_GENERATION;
    }
    
    function calculateWorkerCost(uint256 level, uint256 currentWorkers) public pure returns (uint256) {
        uint256 workerMultiplier = currentWorkers > 0 ? 
            (WORKER_COUNT_COST_MULTIPLIER ** currentWorkers) / (100 ** (currentWorkers - 1)) : 100;
            
        uint256 levelMultiplier = level > 1 ? 
            (WORKER_COST_MULTIPLIER ** (level - 1)) / (100 ** (level - 2)) : 100;
            
        return (BASE_WORKER_COST * workerMultiplier * levelMultiplier) / 10000;
    }
    
    function calculateExpansionCost(uint256 level) public pure returns (uint256) {
        if (level <= 1) return 0;
        
        uint256 multiplier = (EXPANSION_COST_MULTIPLIER ** (level - 1)) / (100 ** (level - 2));
        return (BASE_EXPANSION_COST * multiplier) / 100;
    }
    
    function addWorker(uint256 floorLevel) external nonReentrant {
        Player storage player = players[msg.sender];
        require(floorLevel <= player.highestFloor, "Floor not available");
        
        Floor storage floor = player.floors[floorLevel];
        require(!floor.isLocked, "Floor is locked");
        require(floor.workers < MAX_WORKERS_PER_FLOOR, "Max workers reached");
        
        uint256 cost = calculateWorkerCost(floorLevel, floor.workers);
        require(player.totalGems >= cost, "Insufficient gems");
        
        updateGems(msg.sender);
        player.totalGems -= cost;
        floor.workers++;
        floor.generationRate = calculateFloorGeneration(floor);
        
        emit WorkerAdded(msg.sender, floorLevel, floor.workers);
    }
    
    function unlockFloor(uint256 level) external nonReentrant {
        Player storage player = players[msg.sender];
        require(level <= player.highestFloor + 1, "Invalid floor level");
        require(player.floors[level].isLocked, "Floor already unlocked");
        
        uint256 cost = calculateExpansionCost(level);
        require(player.totalGems >= cost, "Insufficient gems");
        
        updateGems(msg.sender);
        player.totalGems -= cost;
        player.floors[level].isLocked = false;
        
        if (level == player.highestFloor + 1) {
            player.highestFloor = level;
            player.floors[level + 1].level = level + 1;
            player.floors[level + 1].isLocked = true;
        }
        
        emit FloorUnlocked(msg.sender, level);
    }
    
    function calculateFloorGeneration(Floor storage floor) private view returns (uint256) {
        if (floor.isLocked) return 0;
        
        uint256 baseGeneration = BASE_GEM_GENERATION * 
            (FLOOR_PRODUCTION_MULTIPLIER ** (floor.level - 1)) / 
            (100 ** (floor.level - 1));
            
        uint256 workerGeneration = floor.workers * BASE_WORKER_PRODUCTION *
            (WORKER_PRODUCTION_MULTIPLIER ** (floor.level - 1)) / 
            (100 ** (floor.level - 1));
            
        return baseGeneration + workerGeneration;
    }
    
    function updateGems(address playerAddress) public {
        Player storage player = players[playerAddress];
        uint256 totalGeneration = 0;
        
        for (uint256 i = 1; i <= player.highestFloor; i++) {
            Floor storage floor = player.floors[i];
            if (!floor.isLocked) {
                uint256 timePassed = block.timestamp - floor.lastCollected;
                totalGeneration += floor.generationRate * timePassed;
                floor.lastCollected = block.timestamp;
            }
        }
        
        player.totalGems += totalGeneration;
        player.lastUpdate = block.timestamp;
    }
    
    function claimWLDReward() external nonReentrant {
        Player storage player = players[msg.sender];
        require(player.highestFloor >= 5, "Must have at least 5 floors");
        
        // Calculate WLD reward based on progress
        uint256 wldReward = calculateWLDReward(msg.sender);
        require(wldReward > 0, "No reward available");
        require(wldToken.balanceOf(address(this)) >= wldReward, "Insufficient contract balance");
        
        require(wldToken.transfer(msg.sender, wldReward), "WLD transfer failed");
        emit RewardClaimed(msg.sender, wldReward);
    }
    
    function calculateWLDReward(address playerAddress) public view returns (uint256) {
        Player storage player = players[playerAddress];
        // Custom reward logic based on player progress
        uint256 baseReward = 1 ether; // 1 WLD
        uint256 multiplier = player.highestFloor / 5;
        return baseReward * multiplier;
    }
    
    function getPlayerState(address playerAddress) external view returns (
        uint256 totalGems,
        uint256 highestFloor,
        uint256 lastUpdate
    ) {
        Player storage player = players[playerAddress];
        return (
            player.totalGems,
            player.highestFloor,
            player.lastUpdate
        );
    }
    
    function getFloorState(address playerAddress, uint256 floorLevel) external view returns (
        bool isLocked,
        uint256 workers,
        uint256 generationRate
    ) {
        Floor storage floor = players[playerAddress].floors[floorLevel];
        return (
            floor.isLocked,
            floor.workers,
            floor.generationRate
        );
    }
}