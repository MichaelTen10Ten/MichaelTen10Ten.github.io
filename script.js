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
        this.appendStatementInput("CONDITIONS")
            .setCheck(null)
            .appendField("Conditions:")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
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
        this.setColour(160);
    }
};

Blockly.Blocks['number'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Int/Float:")
            .appendField(new Blockly.FieldNumber(0), "NUMBER"); // Use FieldNumber
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(100); // Example color
    }
};

Blockly.Blocks['boolean'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Boolean:")
            .appendField(new Blockly.FieldDropdown([["true", "true"], ["false", "false"]]), "BOOL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
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
        this.setColour(160);
    }
};

var workspace = Blockly.inject('blocklyDiv', {
    toolbox: `
      <xml id="toolbox" style="display: none;">
        <category name="Power Types" colour="230">
          <block type="multiple"></block>
        </category>
        <category name="DataType" colour="160">
          <block type="string"></block>
          <block type="boolean"></block>
          <block type="number"></block>
          <block type="array"></block>
        </category>
      </xml>`,
});
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
        while (block) {
            if (block.type === 'string') {
                output += `"`+block.getFieldValue('TEXT')+`"` + " ";
            } else if (block.type === 'boolean') {
                output += block.getFieldValue('BOOL') + " ";
            } else if (block.type === 'number') {
                output += block.getFieldValue('NUMBER') + " ";
            } else if (block.type === 'array') {
                let containerpower = block.getInputTargetBlock('ITEMS');
                console.log(containerpower)
                output += `[${buildOutput(containerpower)}] `; // Include name and description
            } else if (block.type === 'multiple') {
                let containerName = block.getFieldValue('NAME');        // Get name
                let containerDescription = block.getFieldValue('DESCRIPTION'); // Get description
                let containerpower = block.getInputTargetBlock('POWER');
                let containercondition = block.getInputTargetBlock('CONDITIONS');
                output += `[Container: ${containerName} (${containerDescription}): ${buildOutput(containerpower)}, ${buildOutput(containercondition)}] `; // Include name and description
            }
            block = block.getNextBlock();
        }
        return output;
    }

    document.getElementById('outputArea').value = buildOutput(topBlock).trim();
}


workspace.addChangeListener(updateOutput);

function copyOutput() {
    var outputText = document.getElementById('outputArea');
    outputText.select();
    outputText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(outputText.value);
}

updateOutput();