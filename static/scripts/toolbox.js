let toolbox = `
<!--
<block type="logic_compare"></block>
<block type="controls_repeat_ext"></block>
<block type="math_number">
  <field name="NUM">123</field>
</block>
<block type="math_arithmetic"></block>
<block type="text"></block>
<block type="text_print"></block>-->
<category name="Measures" colour=180>
  <block type="max_diversity"></block>
  <block type="math_on_list">
    <field name="OP">SUM</field>
  </block>
  <block type="jump_k">leading_ones
    <value name="K">
      <shadow type="math_number">
        <field name="NUM">2</field>
      </shadow>
    </value>
  </block>
  <block type="leading_ones"></block>
</category>
<category name="Algorithm parts" colour="230">
  <block type="init_meta"></block>
  <block type="init_uniform"></block>
  <block type="init_constant"></block>
  <block type="pop_init"></block>
  <block type="ea_select_parent"></block>
  <block type="ea_select_best"></block>
  <block type="ea_addtopopulation"></block>
  <block type="ea_run_breeding"></block>
  <block type="run_loop"></block>
  <block type="run_loop_logging">
    <value name="log_every_x_number">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
</category>
<category name="Changing individuals" colour="120">
  <block type="ea_copy"></block>
  <block type="ea_crossover"></block>
  <block type="ea_crossover_onepoint"></block>
  <block type="ea_crossover_twopoint"></block>
  <block type="ea_crossover_uniform"></block>
  <block type="ea_mutate"></block>
  <block type="ea_mutate_prob"></block>
  <block type="ea_mutate_bit"></block>
</category>
<category name="Logging" colour="#777">
  <block type="ea_debug_all"></block>
  <block type="ea_debug">
    <value name="logging_variable">
      <shadow type="text">
        <field name="TEXT"></field>
      </shadow>
    </value>
  </block>
  <block type="ea_log">
    <value name="logging_tag">
      <shadow type="text">
        <field name="TEXT">diversity</field>
      </shadow>
    </value>
  </block>
</category>
<sep></sep>
<category name="{catVariables}" colour="330" custom="VARIABLE"></category>
<category name="{catFunctions}" colour="290" custom="PROCEDURE"></category>
<category name="{catList}" colour="290">
  <block type="lists_create_with">
    <mutation items="0"></mutation>
  </block>
  <block type="lists_create_with"></block>
  <block type="lists_repeat">
    <value name="NUM">
      <shadow type="math_number">
        <field name="NUM">5</field>
      </shadow>
    </value>
  </block>
  <block type="lists_length"></block>
  <block type="lists_isEmpty"></block>
  <block type="lists_indexOf">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">{listVariable}</field>
      </block>
    </value>
  </block>
  <block type="lists_getIndex">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">{listVariable}</field>
      </block>
    </value>
  </block>
  <block type="lists_setIndex">
    <value name="LIST">
      <block type="variables_get">
        <field name="VAR">{listVariable}</field>
      </block>
    </value>
  </block>
  <block type="lists_getSublist">
    <value name="LIST">
      <block type="variables_get">
        <field name="VAR">{listVariable}</field>
      </block>
    </value>
  </block>
  <block type="lists_split">
    <value name="DELIM">
      <shadow type="text">
        <field name="TEXT">,</field>
      </shadow>
    </value>
  </block>
  <block type="lists_sort"></block>
  <block type="lists_concat"></block>
  <block type="lists_append"></block>
</category>
<category name="{catLogic}" colour="290">
  <block type="controls_if"></block>
  <block type="logic_compare"></block>
  <block type="logic_operation"></block>
  <block type="logic_negate"></block>
  <block type="logic_boolean"></block>
  <block type="logic_null"></block>
  <block type="logic_ternary"></block>
</category>
<category name="{catMath}" colour="230">
  <block type="math_number"></block>
  <block type="math_arithmetic"></block>
  <block type="math_on_list"></block>
  <block type="math_random_int"></block>
  <block type="math_constrain"></block>
</category>
<category name="{catLoops}" colour="120">
  <block type="controls_repeat_ext">
    <value name="TIMES">
      <shadow type="math_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="controls_whileUntil"></block>
  <block type="controls_for">
    <value name="FROM">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="TO">
      <shadow type="math_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
    <value name="BY">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
  <block type="controls_forEach"></block>
  <block type="controls_flow_statements"></block>
</category>
<sep></sep>
<category name="Multi-Threading" colour="#338899">
  <block type="run_thread">
    <value name="thread_count">
      <shadow type="math_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
    <value name="return_value">
      <shadow type="math_number">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>
  <block type="thread_import_variable"></block>
  <block type="thread_num"></block>
  <block type="fibonacci">
    <value name="fib_number">
      <shadow type="math_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
</category>
`

document.getElementById("toolbox").innerHTML = toolbox;