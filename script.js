Blockly.Blocks['sentence_part'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Part of Sentence:")
            .appendField(new Blockly.FieldTextInput("Enter text here"), "TEXT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setOutput(true, 'String');
        this.setColour(160);
    }
};

Blockly.Blocks['sentence_container'] = {
    init: function () {
        this.appendStatementInput("ITEMS")
            .setCheck(null)
            .appendField("Sentence Parts");
        this.setPreviousStatement(true, null); // Container can connect above
        this.setNextStatement(true, null);     // Container can connect below
        this.setColour(230);
    }
};

var workspace = Blockly.inject('blocklyDiv', {
    toolbox: `
      <xml id="toolbox" style="display: none;">
        <category name="Sentence Parts" colour="160">
          <block type="sentence_part"></block>
        </category>
        <category name="Containers" colour="230">
          <block type="sentence_container">
            <statement name="ITEMS">
              <block type="sentence_part"></block> 
            </statement>
          </block>
        </category>
      </xml>`,
});

function updateOutput() {
    var topBlock = workspace.getTopBlocks(true)[0]; // Start at the top

    function buildOutput(block) {
        let output = "";
        while (block) {
            if (block.type === 'sentence_part') {
                output += block.getFieldValue('TEXT') + " ";
            } else if (block.type === 'sentence_container') {
                let itemsBlock = block.getInputTargetBlock('ITEMS');
                output += buildOutput(itemsBlock); // Recursively handle nested containers
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