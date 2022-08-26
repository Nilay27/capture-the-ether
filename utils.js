const fs = require("fs");
const hre = require("hardhat");
const fileContents = fs.readFileSync("./README.md", "utf8");

function calculateTotalPoints(updatedContent) {
  var lines = updatedContent.split("\n");
  var numLines = lines.length;
  var i;
  var totalPoints = 0;
  for (i = 0; i < numLines; i++) {
    var line = lines[i];
    if (line.indexOf("x") == 3 && line.indexOf("-") == 0) {
      var words = line.split("(");
      var point = words[1].split(" ")[0];
      totalPoints += parseInt(point);
    } else {
      continue;
    }
  }
  return totalPoints;
}

exports.updateTotalPoints = function (challengeName) {
  var networkName = hre.network.name;
  if (networkName != "ropsten") {
    throw new Error(
      `Your tests pass, but you are not on Ropsten, instead you are currently working on ${networkName} network
            Please use --network ropsten`
    );
  }
  challengeName = challengeName.split(".")[0];
  var lines = fileContents.split("\n");
  var updatedContent = "";
  var numLines = lines.length;
  var i;
  for (i = 0; i < numLines; i++) {
    var line = lines[i];
    if (line.includes(challengeName)) {
      if (line.includes("[ ]")) {
        var newLine = line.replace("[ ]", "[x]");
        updatedContent = fileContents.replace(line, newLine);
      }
    }
  }
  if (updatedContent != "") {
    var progress = calculateTotalPoints(updatedContent).toString() + "/11600";
    for (i = 0; i < numLines; i++) {
      var line = lines[i];
      if (line.includes("Progress")) {
        updatedContent = updatedContent.replace(line, " Progress: " + progress);
      }
    }
    fs.writeFileSync("./README.md", updatedContent);
  }
};

//updateTotalPoints("ChooseANickname.js")
