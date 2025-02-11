
// Template Block (modified to accept JSON inputs)
Blockly.Blocks['template_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Template Block");
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("Name");
        this.appendValueInput("VALUE")
            .setCheck(["String", "Number", "Boolean", "Array", "JSON"]) // Accept JSON
            .appendField("Value");
        this.setOutput(true, "JSON");
        this.setColour(160);
        this.setTooltip("Template block for JSON generation.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['template_block'] = function (block) {
    var name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null'; // Default to null

    const isNumber = /^-?\d+(\.\d+)?$/.test(value);
    const isBoolean = value === 'true' || value === 'false';

    //if(!isNumber && !isBoolean && !value.startsWith('[') && !value.startsWith('{')){ //check if the value is not a number, boolean, array, or JSON
    //    value = `"${value.replace(/"/g, '\\"')}"`; //Escape double quotes in the value
    //}
    //if (!value.startsWith('"') && !value.endsWith('"') && !value.startsWith('[') && !value.startsWith('{') && !/^-?\d+(\.\d+)?$/.test(value) && value !== 'true' && value !== 'false' && value !== 'null') {
    //  value = `"${value.replace(/"/g, '\\"')}"`; // Only add quotes if necessary
    //}
    if (value.startsWith('(') && value.endsWith(')')) { // Check if it's wrapped
        value = value.slice(1, -1); // Remove parentheses
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1); // Remove quotes if present
        }
    } else if (!value.startsWith('"') && !value.endsWith('"') && !value.startsWith('[') && !value.startsWith('{') && !/^-?\d+(\.\d+)?$/.test(value) && value !== 'true' && value !== 'false' && value !== 'null') {
        value = `"${value.replace(/"/g, '\\"')}"`; // Only add quotes if necessary
    }

    var jsonString = `{${name}:${value}}`;
    return [jsonString, Blockly.JavaScript.ORDER_NONE];
};

// String Block
Blockly.Blocks['string_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("String")
            .appendField(new Blockly.FieldTextInput(""), "TEXT");
        this.setOutput(true, "String");
        this.setColour(200);
    }
};

Blockly.JavaScript['string_block'] = function (block) {
    var text = block.getFieldValue('TEXT');
    return [`"${text.replace(/"/g, '\\"')}"`, Blockly.JavaScript.ORDER_ATOMIC]; // Escape quotes
};

// Boolean Block
Blockly.Blocks['boolean_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["true", "true"], ["false", "false"]]), "BOOL");
        this.setOutput(true, "Boolean");
        this.setColour(220);
    }
};

Blockly.JavaScript['boolean_block'] = function (block) {
    var bool = block.getFieldValue('BOOL');
    return [bool, Blockly.JavaScript.ORDER_ATOMIC];
};

// Array Block
Blockly.Blocks['array_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Array");
        this.appendStatementInput("ITEMS")
            .setCheck(["String", "Number", "Boolean", "Array", "JSON"]);
        this.setOutput(true, "Array");
        this.setColour(240);
    }
};

Blockly.JavaScript['array_block'] = function (block) {
    var itemsCode = Blockly.JavaScript.statementToCode(block, 'ITEMS');
    if (!itemsCode) {
        return ['[]', Blockly.JavaScript.ORDER_ATOMIC]; // Return empty array if no items
    }


    var items = itemsCode.split('\n').filter(item => item !== '').map(item => {
        if (item.startsWith('(') && item.endsWith(')')) {
            return item.slice(1, -1); // Remove parentheses if present
        }
        console.log(`${item.slice(2)}`);
        item = item.slice(2);
        return item;
    }).join(',');

    console.log(`[${items}]`)
    return `[${items}]`, Blockly.JavaScript.ORDER_ATOMIC;
};


// Array Item Block (Corrected - KEY FIX)
Blockly.Blocks['array_item'] = {
    init: function () {
        this.appendValueInput("VALUE")
            .setCheck(["String", "Number", "Boolean", "Array", "JSON"])
            .appendField("Item");
        this.setPreviousStatement(true, ["String", "Number", "Boolean", "Array", "JSON"]);
        this.setNextStatement(true, ["String", "Number", "Boolean", "Array", "JSON"]);
        this.setColour(260);
    }
};

Blockly.JavaScript['array_item'] = function (block) {
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';

    if (value.startsWith('(') && value.endsWith(')')) {
        value = value.slice(1, -1);
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
    } else if (!value.startsWith('"') && !value.endsWith('"') && !value.startsWith('[') && !value.startsWith('{') && !/^-?\d+(\.\d+)?$/.test(value) && value !== 'true' && value !== 'false' && value !== 'null') {
        value = `"${value.replace(/"/g, '\\"')}"`; // Only add quotes if necessary
    }

    return value + "\n";
};


var workspace = Blockly.inject('blocklyDiv',
    {
        toolbox: `
        <xml id="toolbox" style="display: none">
          <block type="template_block"></block>
          <block type="string_block"></block>
          <block type="boolean_block"></block>
          <block type="array_block"></block>
          <block type="array_item"></block>
        </xml>`});

// ... (rest of the code for updateJsonOutput remains the same)
function updateJsonOutput() {
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var jsonOutput = document.getElementById('jsonOutput');

    try {
        // Evaluate the generated code (which should create a JSON string)
        //const evalResult = eval(code);
        // Parse to check if it's valid JSON. If not, stringify it
        //const parsedJson = JSON.parse(evalResult);
        jsonOutput.textContent = JSON.stringify(parsedJson, null, 2); // Pretty print

    } catch (error) {
        // Handle cases where the generated code is not valid JSON
        jsonOutput.textContent = "Error generating JSON: " + error.message + "\nGenerated Code:\n" + code; // Display error and the code
    }
    jsonOutput.textContent = "Generated Code:\n" + code;
}

workspace.addChangeListener(updateJsonOutput); // Update on every change
updateJsonOutput(); // Initial update