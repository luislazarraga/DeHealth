pragma solidity ^0.8.0;

contract SBT {
    struct PersonalData {
        string name;
        string surname;
        string country;
        // Otros atributos relevantes para la identidad de la persona
    }
    
    mapping (address => PersonalData) private sbtData;
    mapping (address => bool) private sbtExists;
    
    function createSBT(string memory name, string memory surname, string memory country) public {
        require(!sbtExists[msg.sender], "Ya existe un SBT para esta dirección");
        sbtData[msg.sender] = PersonalData(name, surname, country);
        sbtExists[msg.sender] = true;
    }
    
    function getSBTData(address sbtAddress) public view returns (string memory, string memory, string memory) {
        require(sbtExists[sbtAddress], "No existe un SBT para esta dirección");
        PersonalData memory data = sbtData[sbtAddress];
        return (data.name, data.surname, data.country);
    }
}
