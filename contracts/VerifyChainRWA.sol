// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerifyChainRWA is ERC20, Ownable {
    
    struct Bond {
        uint256 id;
        string name;
        string isin;
        string docHash;      // SHA256 Hash from Python
        string ipfsLink;
        uint256 yieldRate;   // Basis points (e.g. 720 = 7.20%)
        uint256 maturity;
        bool verified;
    }

    uint256 public nextBondId;
    mapping(uint256 => Bond) public bonds;

    event BondMinted(uint256 indexed id, string name, address indexed issuer);

    constructor() ERC20("India Govt Bond Token", "IGBT") Ownable(msg.sender) {}

    function mintBond(
        string memory _name,
        string memory _isin,
        string memory _docHash,
        string memory _ipfsLink,
        uint256 _yieldRate,
        uint256 _totalSupply
    ) public onlyOwner {
        nextBondId++;
        bonds[nextBondId] = Bond(nextBondId, _name, _isin, _docHash, _ipfsLink, _yieldRate, block.timestamp + 365 days, true);
        _mint(msg.sender, _totalSupply * 10**18);
        emit BondMinted(nextBondId, _name, msg.sender);
    }

    function verifyIntegrity(uint256 _bondId, string memory _hashToCheck) public view returns (bool) {
        return (keccak256(abi.encodePacked(bonds[_bondId].docHash)) == keccak256(abi.encodePacked(_hashToCheck)));
    }
}