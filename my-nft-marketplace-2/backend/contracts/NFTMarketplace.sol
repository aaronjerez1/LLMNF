// NFTMarketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event ItemListed(address indexed seller, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event ItemBought(address indexed buyer, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event Log(string message);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function listItem(address nftContract, uint256 tokenId, uint256 price) public {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner of the token");
        require(price > 0, "Price must be greater than 0");

        emit Log("Transfer attempt");
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit Log("Transfer success");

        listings[nftContract][tokenId] = Listing(msg.sender, price);

        emit ItemListed(msg.sender, nftContract, tokenId, price);
    }

    function buyItem(address nftContract, uint256 tokenId) public payable {
        Listing memory listing = listings[nftContract][tokenId];
        require(msg.value >= listing.price, "Not enough ether to cover the price");
        require(listing.seller != address(0), "Item not listed");

        delete listings[nftContract][tokenId];
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        payable(listing.seller).transfer(listing.price);

        emit ItemBought(msg.sender, nftContract, tokenId, listing.price);
    }
}
