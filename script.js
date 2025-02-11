//POWER
Blockly.Blocks['multiple'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Multiple")
        this.appendDummyInput()
            .appendField("Name:")
            .appendField(new Blockly.FieldTextInput("NAME"), "NAME") // Name input
        this.appendDummyInput()
            .appendField("Description:")
            .appendField(new Blockly.FieldTextInput("DESCRIPTION"), "DESCRIPTION") // Name input
        this.appendStatementInput("POWER")
            .setCheck(null)
            .appendField("Powers:")
        this.setNextStatement(true, null);
        this.setColour(100);
        this.setDeletable(false);
    }
};
Blockly.Blocks['attribute_modify_transfer'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Attribute Modify Transfer")
        this.appendDummyInput()
            .appendField("Power Name:")
            .appendField(new Blockly.FieldTextInput("name"), "NAME") // Name input
        this.appendDummyInput()
            .appendField("Class:")
            .appendField(new Blockly.FieldTextInput("CLASS"), "CLASS") // Name input
        this.appendDummyInput()
            .appendField("Attribute:")
            .appendField(new Blockly.FieldTextInput("ATTRIBUTE"), "ATTRIBUTE") // Name input
        this.appendDummyInput()
            .appendField("Multiplier:")
            .appendField(new Blockly.FieldNumber(1.0), "MULTIPLIER") // Name input
        this.appendStatementInput("CONDITIONS")
            .setCheck(null)
            .appendField("Conditions:")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(100);
    }
};
























//DATA
Blockly.Blocks['string'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("String:")
            .appendField(new Blockly.FieldTextInput("Enter text here"), "TEXT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(100);
    }
};

Blockly.Blocks['boolean'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Boolean:")
            .appendField(new Blockly.FieldDropdown([["true", "true"], ["false", "false"]]), "BOOL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
    }
};

Blockly.Blocks['number'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Int/Float:")
            .appendField(new Blockly.FieldNumber(0), "NUMBER"); // Use FieldNumber
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300); // Example color
    }
};

Blockly.Blocks['array'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Array:")
        this.appendStatementInput("ITEMS")
            .setCheck(null)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(400);
    }
};

//CONTAINER
var workspace = Blockly.inject('blocklyDiv', {
    toolbox: `
      <xml id="toolbox" style="display: none;">
        <category name="Power Types" colour="100">
          <block type="attribute_modify_transfer"></block>
        </category>
        <category name="Data Types" colour="200">
          <block type="string"></block>
          <block type="boolean"></block>
          <block type="number"></block>
          <block type="array"></block>
        </category>
        <category name="Conditions" colour="300">

        </category>
      </xml>`,
});





















//FUNCTIONS
function placeInitialContainer() {
    var containerBlock = workspace.newBlock('multiple'); // Create the block
    containerBlock.initSvg(); // Initialize rendering (very important!)
    containerBlock.render();   // Actually render the block
}

// Call the function when the page loads
window.addEventListener('load', placeInitialContainer);

function updateOutput() {
    let topBlock = workspace.getTopBlocks(true)[0];

    function buildOutput(block) {
        let output = "";
        let POWERoutput = "";
        let CONDITIONSoutput = ""; // Store the output of items within a container
        while (block) {
            if (block.type === 'string') {
                output += `"` + block.getFieldValue('TEXT') + `"` + " ";
            } else if (block.type === 'boolean') {
                output += block.getFieldValue('BOOL') + " ";
            } else if (block.type === 'number') {
                output += block.getFieldValue('NUMBER') + " ";
            } else if (block.type === 'array') {
                let containerpower = block.getInputTargetBlock('ITEMS');
                console.log(containerpower)
                output += `[${buildOutput(containerpower)}] `; // Include name and description
            }




            else if (block.type === 'multiple') {
                let NAME = block.getFieldValue('NAME');        // Get name
                let DESCRIPTION = block.getFieldValue('DESCRIPTION'); // Get description
                let POWER = block.getInputTargetBlock('POWER');
                POWERoutput = buildOutput(POWER);
                if (POWERoutput) {
                    console.log(POWERoutput)
                    POWERoutput = POWERoutput.split(`}"`).filter(item => item !== "").join(`},"`); // Split by space, remove empty strings, join with slash
                    console.log(POWERoutput)
                }
                
                output += `{"type": "origins:multiple","name": "${NAME}","description": "${DESCRIPTION}", ${POWERoutput}}`; // Include name and description
            } else if (block.type === 'attribute_modify_transfer') {
                let NAME = block.getFieldValue('NAME');        // Get name
                let CLASS = block.getFieldValue('CLASS'); // Get description
                let ATTRIBUTE = block.getFieldValue('ATTRIBUTE'); // Get description
                let MULTIPLIER = block.getFieldValue('MULTIPLIER'); // Get description
                let CONDITIONS = block.getInputTargetBlock('CONDITIONS');
                CONDITIONSoutput = buildOutput(CONDITIONS);
                if (CONDITIONSoutput) {
                    //console.log(CONDITIONSoutput)
                    CONDITIONSoutput = CONDITIONSoutput.split(`}"`).filter(item => item !== "").join(`},"`); // Split by space, remove empty strings, join with slash
                    //console.log(CONDITIONSoutput)
                }
                output += `"${NAME}":{"type": "origins:attribute_modify_transfer","class": "${CLASS}","attribute": "${ATTRIBUTE}","multiplier":${MULTIPLIER},"condition":{"type": "origins:and","conditions": [${CONDITIONSoutput}]}}`; // Include name and description
            }
            block = block.getNextBlock();
        }
        return output;
    }

    output = buildOutput(topBlock).trim()
    //console.log(output)
    if (output) {
        output = eval("(" + output + ")");
        output = JSON.stringify(output, null, 2)
    }
    //console.log(output)
    document.getElementById('outputArea').value = output;
}


workspace.addChangeListener(updateOutput);

function copyOutput() {
    var outputText = document.getElementById('outputArea');
    outputText.select();
    outputText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(outputText.value);
}

updateOutput();