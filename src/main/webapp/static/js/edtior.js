/**
 * Created by Administrator on 2015/6/27.
 */
window.onload=function(){
    var width = $("#cParent").width();
    var height = $("#cParent").height();
    $("#c").attr("height",height);
    $("#c").attr("width",width);
    var _cornerSize = 6;
    var canvas = new fabric.Canvas('c',{
        backgroundColor: '#ffffff',
        //selection:false,
        cornerSize: _cornerSize,
        transparentCorners: false
    });
    var rect;
    var selected = null;
    var lookForm = document.getElementById('look-and-transform');
    var createForm = document.getElementById('pan');
    //记录图形个数
    var num_Rect=0,num_Circle=0,num_Triangle= 0,num_Text= 0,num_Line= 0,num_Polygon= 0,num_Freedraw= 0,num_Library= 0,num_Group= 0,num_Library=0;
    var moduleList = new Array();
    var animationList = new Array();
    var timeNum = 0;
    var maxTime = 0;
    var originalCanvas;



    var init = function(){
        var url = getRootPath()+"/flash/loadCanvas"
        $.ajax({
            type: 'POST',
            url: url,
            success: function (result) {
                if (result.code == 200) {
                    var canvasJson = JSON.parse(result.data.content);
                    var objects = canvasJson.objects;
                    var flashContent = JSON.parse(result.data.flashContent);
                    if (flashContent && flashContent.animationList) {
                        var animationJson = flashContent.animationList;
                        var a = reflashAnimationList(animationJson);
                    }
                    for(var i=0; i<objects.length;i++){
                        var html = objects[i].alias;
                        var module  = document.getElementById("module");
                        var a = document.createElement("a");
                        a.href="javascript:void(0);";
                        a.setAttribute("class","list-group-item list-group-item-info");
                        a.setAttribute("name","moduleList");
                        a.innerHTML = html;
                        module.appendChild(a);
                        addObjectWhenInit(objects[i]);
                        moduleList.push(objects[i]);
                    }
                    if (canvasJson.num_Rect) {
                        num_Rect = canvasJson.num_Rect;
                    }
                    if (canvasJson.num_Circle) {
                        num_Circle = canvasJson.num_Circle;
                    }
                    if(canvasJson.num_Triangle) {
                        num_Triangle = canvasJson.num_Triangle;
                    }
                    if(canvasJson.num_Text) {
                        num_Text = canvasJson.num_Text;
                    }
                    if(canvasJson.num_Line) {
                        num_Line = canvasJson.num_Line;
                    }
                    if(canvasJson.num_Polygon) {
                        num_Polygon = canvasJson.num_Polygon;
                    }
                    if(canvasJson.num_Freedraw) {
                        num_Freedraw = canvasJson.num_Freedraw;
                    }
                    if(canvasJson.num_Library) {
                        num_Library = canvasJson.num_Library;
                    }
                    if(canvasJson.num_Group) {
                        num_Group = canvasJson.num_Group;
                    }
                    if(canvasJson.num_Library){
                        num_Library = canvasJson.num_Library;
                    }
                    var canvasJ = {};
                    canvasJ.objects = objects;
                    canvasJ.background = canvasJson.background;
                    originalCanvas = canvasJ;
                    canvas.loadFromJSON(canvasJ);
                }
            }
        });
    }
    init();

    //加载数据时，如果是组合，那么加上_objects属性
    function addObjectWhenInit(obj){
        if (obj.objects){
            for(var i=0;i<obj.objects.length;i++){
                if (obj.objects[i].objects){
                    addObjectWhenInit(obj.objects[i])
                }
            }
            obj._objects = obj.objects;
        }
    }

    //加载用户保存的flash
    function reflashAnimationList(animationJson) {
        var animations = document.getElementById("animationList");
        animations.innerHTML = "";
        animationList = new Array();
        for (var i = 0; i < animationJson.length; i++) {
            var html = animationJson[i].shape + "/" + animationJson[i].startTime / 1000 + "s-" + animationJson[i].endTime / 1000 + "s";
            var a = document.createElement("a");
            a.href = "javascript:void(0);";
            a.setAttribute("class", "list-group-item list-group-item-info");
            a.setAttribute("name", "animationList");
            a.innerHTML = html;
            var iTag = document.createElement("i");
            iTag.setAttribute("class", "iconfont btn");
            iTag.setAttribute("index", animationList.length);
            iTag.setAttribute("name", "deleteAnimation");
            iTag.innerHTML = "&#xe615;";
            animations.appendChild(a);
            animations.appendChild(iTag);
            maxTime = 0;
            var endTime = animationJson[i].endTime;
            if (endTime>maxTime){
                maxTime = endTime;
            }
            animationList.push(animationJson[i]);
        }
        return a;
    }

    function loadCanvas(){
        addObjectToGroupWhenLoad(originalCanvas);
        canvas.loadFromJSON(originalCanvas);
        canvas.renderAll();
        var objects = originalCanvas.objects;
        var module  = document.getElementById("module");
        module.innerHTML = "";
        moduleList = new Array();
        for(var i=0; i<objects.length;i++){
            var html = objects[i].alias;
            var a = document.createElement("a");
            a.href="javascript:void(0);";
            a.setAttribute("class","list-group-item list-group-item-info");
            a.setAttribute("name","moduleList");
            a.innerHTML = html;
            module.appendChild(a);
            moduleList.push(objects[i]);
        }
    }
    //加载时把所有有_objects属性的都加到objects上
    function addObjectToGroupWhenLoad(originalCanvas){
        if (originalCanvas.objects) {
            for (var i = 0; i < originalCanvas.objects.length; i++) {
                if (originalCanvas.objects[i]._objects) {
                    addObjectToGroupWhenLoad(originalCanvas.objects[i])
                }
                originalCanvas.objects[i].objects = originalCanvas.objects[i]._objects;
            }
        }
    }

    $("#mouse").click(function(){
        isdraw = false;
        selected = null;
    })

    function addToModuleList(_shape,num,name) {
        innerhtml = name + num;
        var module = document.getElementById("module");
        $('#module > a').each(function () {
            $(this).attr("class", "list-group-item list-group-item-info");
        });
        var a = document.createElement("a");
        a.href = "javascript:void(0);";
        if (name == "library") {
            a.setAttribute("class", "list-group-item list-group-item-info");
        } else {
            a.setAttribute("class", "list-group-item list-group-item-info active");
        }
        a.setAttribute("name","moduleList");
        a.innerHTML = innerhtml;
        module.appendChild(a);
        _shape.alias = name + num;
        moduleList.push(_shape);
        return a;
    }

    function updateModuleList() {
        var module = document.getElementById("module");
        module.innerHTML = "";
        for(var i=0;i<moduleList.length;i++) {
            innerhtml = moduleList[i].alias;
            var a = document.createElement("a");
            a.href = "javascript:void(0);";
            a.setAttribute("class", "list-group-item list-group-item-info");
            a.setAttribute("name", "moduleList");
            a.innerHTML = innerhtml;
            module.appendChild(a);
        }
    }

    function addToModule(_shape,name){
        if(name=="rect"){
            num_Rect++;
            addToModuleList(_shape,num_Rect,name);
        }else if(name=="circle"){
            num_Circle++;
            addToModuleList(_shape,num_Circle,name);
        }else if(name=="triangle"){
            num_Triangle++;
            addToModuleList(_shape,num_Triangle,name);
        }else if(name=="text"){
            num_Text++;
            addToModuleList(_shape,num_Text,name);
        } else if(name=="line"){
            num_Line++;
            addToModuleList(_shape,num_Line,name);
        }else if(name=="polygon"){
            num_Polygon++;
            addToModuleList(_shape,num_Polygon,name);
        }else if(name=="group"){
            addAliasToGroupWhenCopy(_shape);
            num_Group++;
            addToModuleList(_shape,num_Group,name);
        }else if (name = "freedraw"){
            num_Freedraw++;
            addToModuleList(_shape,num_Freedraw,name);
        }else if (name = "library"){
            num_Library++;
            addToModuleList(_shape,num_Library,name);
        }
    }
    //复制时把组合的每个成员的alias加下
    function addAliasToGroupWhenCopy(_shape){
        if (_shape._objects){
            for(var i=0;i<_shape._objects.length;i++){
                var object = _shape._objects[i];
                var name = object.type;
                if(name=="rect"){
                    num_Rect++;
                    object.alias = name+num_Rect;
                }else if(name=="circle"){
                    num_Circle++;
                    object.alias = name+num_Circle;
                }else if(name=="triangle"){
                    num_Triangle++;
                    object.alias = name+num_Triangle;
                }else if(name=="text"){
                    num_Text++;
                    object.alias = name+num_Text;
                } else if(name=="line"){
                    num_Line++;
                    object.alias = name+num_Line
                }else if(name=="polygon"){
                    num_Polygon++;
                    object.alias = name + num_Polygon;
                }else if(name=="group"){
                    num_Group++;
                    object.alias = name + num_Group
                }else if (name = "freedraw"){
                    num_Freedraw++;
                    object.alias = name + num_Freedraw;
                }else if (name = "library"){
                    num_Library++;
                    object.alias = name + num_Library;
                }
                addAliasToGroupWhenCopy(object)
            }
        }
    }

    //默认图形参数
    var shapeInfo = {
        rect: {left:100,top:100,width:200,height:100,rx:0,ry:0,originX: 'center', originY: 'center'},
        circle: {left:100,top:100,radius:50,originX: 'center', originY: 'center'},
        triangle: {left:100,top:100,width:80,height:100,rx:0,ry:0,originX: 'center', originY: 'center'},
        line: {x1:100,y1:100,x2:100,y2:200,originX: 'center', originY: 'center'},
        text:{left:100,top:100,fontSize:20,text:'hello',originX: 'center', originY: 'center'},
        //polygon:[{x: 170, y: 210},{x: 217.023, y: 234.721},{x: 208.042, y: 182.361},{x: 246.085, y: 145.279},{x: 193.511, y: 137.639},{x: 170, y: 90},{x: 146.489, y: 137.639},{x: 93.915, y: 145.279},{x: 131.958, y: 182.361},{x: 122.977, y: 234.721},{x: 170, y: 210}],{left: 250,top: 160,width: 200,height: 200}
    };
    //var pp = [{x: 170, y: 210},{x: 217.023, y: 234.721},{x: 208.042, y: 182.361},{x: 246.085, y: 145.279},{x: 193.511, y: 137.639},{x: 170, y: 90},{x: 146.489, y: 137.639},{x: 93.915, y: 145.279},{x: 131.958, y: 182.361},{x: 122.977, y: 234.721},{x: 170, y: 210}],{left: 250,top: 160,width: 200,height: 200};
    //默认属性参数
    var defaultAttrs = {
        fill: '#00D5FF',
        stroke: '#FFFFFF',
        strokeWidth: 0
    };
    //点击图形面板，创建图形
    createForm.addEventListener('click', function(e) {
        if (e.target.tagName.toLowerCase() == 'i') {
            if (e.target.getAttribute('create')) {
                create(e.target.getAttribute('create'));
            }
        }
    });
    //点击属性面板，更改属性
    lookForm.addEventListener('input', function(e) {
        if (e.target.tagName.toLowerCase() != 'input') return;
        if (!selected) return;
        var handle = e.target;
        if (handle.name=="animation_left") {
            selected.setLeft(parseFloat(handle.value)).setCoords();
        }
        if (handle.name=="animation_top") {
            selected.setTop(parseFloat(handle.value)).setCoords();
        }
        if (handle.name=="animation_fill") {
            selected.setFill(handle.value).setCoords();
        }
        if (handle.name=="animation_stroke") {
            selected.setStroke(handle.value).setCoords();
        }
        if (handle.name=="animation_strokeWidth") {
            selected.setStrokeWidth(handle.value).setCoords();
        }
        if (handle.name=="animation_width") {
            selected.setWidth(parseFloat(handle.value)).setCoords();
            selected.setScaleX(1);
        }
        if (handle.name=="animation_height") {
            selected.setHeight(parseFloat(handle.value)).setCoords();
            selected.setScaleY(1);
        }
        if (handle.name=="animation_angle") {
            selected.setAngle(parseFloat(handle.value)).setCoords();
        }
        if (handle.name=="animation_opacity") {
            selected.setOpacity(parseFloat(handle.value)).setCoords();
        }
        if (handle.name=="animation_text") {
            selected.setText(handle.value).setCoords();
        }
        defaultAttrs.fill = $("input[name='animation_fill']").attr("value" );
        canvas.renderAll();
    });
    //创建图形
    function create(name) {
        if(name=="rect"){
            canvas.isDrawingMode = false;
            shape = new fabric.Rect();
            addToModule(shape,"rect");
        }else if(name=="circle"){
            canvas.isDrawingMode = false;
            shape = new fabric.Circle();
            addToModule(shape,"circle");
        }else if(name=="triangle"){
            canvas.isDrawingMode = false;
            shape = new fabric.Triangle();
            addToModule(shape,"triangle");
        } else if(name=="line"){
            canvas.isDrawingMode = false;
            shape = new fabric.Line();
            addToModule(shape,"line");
        }else if(name=="text"){
            canvas.isDrawingMode = false;
            shape = new fabric.Text("hello");
            addToModule(shape,"text");
        }else if (name=="mouse"){
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = Circle;
            addToModule(shape,"freedraw");
        }
        shape.name = name;
        shape.set(shapeInfo[shape.name]);
        if(name=="line"){
            shape.set({fill: '#00D5FF',
                stroke: '#00D5FF',
                strokeWidth: 1})
        }
        else {
            shape.set(defaultAttrs);
        }
        canvas.add(shape).setActiveObject(shape);
        select(shape);
    }
    //选中图形，用于属性栏更改属性用的
    function select(shape) {
            createHandle(shape);
            selected = shape;
        var name = shape.alias;
        $('#module > a').each(function () {
            if( $(this).html()==name){
                $(this).attr("class","list-group-item list-group-item-info active");
            }
            else {
                $(this).attr("class","list-group-item list-group-item-info");
            }
        });
            updateLookHandle();
        //}else {
        //    selected = shape;
        //}
    }

    //将属性加到图形上
    function createHandle(shape) {
        //addAttr("left",shape);
        //addAttr("top",shape);
        if(shape) {
            var name = shape.type;
            if (name == 'text') {
                addTextAttr(text, shape);
            }
        }
    }
    //单独增加range属性
    function addAttr(name,shape){
        var label = document.createElement('label');
        label.textContent = name;
        var handle = document.createElement('input');
        handle.setAttribute('name', name);
        handle.setAttribute('type', 'range');
        handle.setAttribute('value', shape.left);
        handle.setAttribute('min', 0);
        if (name=="left") {
            handle.setAttribute('max', canvas.width);
        }
        if (name=="top") {
            handle.setAttribute('max', canvas.height);
        }
        lookForm.appendChild(label);
        lookForm.appendChild(handle);
    }
    //单独增加text属性
    function addTextAttr(name,shape){
        var div = document.createElement("div");
        div.setAttribute("class","input-group");
        div.setAttribute("style","margin-top: 5px");
        var span = document.createElement('span');
        span.setAttribute("class","input-group-addon");
        span.innerHTML="文本";
        div.appendChild(span);
        var input = document.createElement('input');
        input.setAttribute("id", "animation_text1");
        input.setAttribute("name", "animation_text");
        input.setAttribute("class","form-control");
        input.setAttribute('type', 'text');
        input.setAttribute('value', shape.text);
        div.appendChild(input);
        lookForm.appendChild(div);
    }

    //更新属性参数 颜色，线条粗细，位置，旋转角度
    function updateLookHandle() {
        $("#animation_fill1").val(selected.getFill());
        $("#animation_stroke1").val(selected.getStroke());
        $("#animation_strokeWidth1").val(selected.getStrokeWidth());
        $("#animation_left1").val(selected.getLeft());
        $("#animation_top1").val(selected.getTop());
        $("#animation_width1").val(selected.getWidth());
        $("#animation_height1").val(selected.getHeight());
        $("#animation_angle1").val(selected.getAngle());
        $("#animation_opacity1").val(selected.getOpacity());
        if (selected.tyep=="text") {
            $("#animation_text1").val(selected.getText());
        }
        $("#animation_fill2").val(selected.getFill());
        $("#animation_stroke2").val(selected.getStroke());
        $("#animation_left2").val(selected.getLeft());
        $("#animation_top2").val(selected.getTop());
        $("#animation_width2").val(selected.getWidth());
        $("#animation_height2").val(selected.getHeight());
        $("#animation_angle2").val(selected.getAngle());
        $("#animation_opacity2").val(selected.getOpacity());
        //$("input[name='animation_left']").attr("value" ,selected.getLeft());
        //$("input[name='animation_top']").attr("value" ,selected.getTop());
        //$("input[name='animation_fill']").val("value" ,selected.getFill());
        //$("input[name='animation_stroke']").val("value" ,selected.getStroke());
        //$("input[name='animation_width']").attr("value" ,selected.getWidth());
        //$("input[name='animation_height']").attr("value" ,selected.getHeight());
        //$("input[name='animation_angle']").attr("value" ,selected.getAngle());
        //$("input[name='animation_opacity']").attr("value" ,selected.getOpacity());
        //rotate.value = selected ? selected.rotate : 0;
    }
    //禁止表单回车键
    document.onkeydown = function(event) {
        var target, code, tag;
        if (!event) {
            event = window.event; //针对ie浏览器
            target = event.srcElement;
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "text") { return true; }
                else { return false; }
            }
        }
        else {
            target = event.target; //针对遵循w3c标准的浏览器，如Firefox
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "INPUT") { return false; }
                else { return true; }
            }
        }
    };
    //保存用户的flash
    $("#save").click(function(){
        var canvasJson = JSON.parse(JSON.stringify(canvas));
        var canvasObjects = canvasJson.objects;
        var objects = new Array();
        for (var i=0;i<moduleList.length;i++){
            var object = moduleList[i];
            var canvasObject = canvasObjects[i];
            var ob;
            if(canvasObject.canvas) {
                ob = canvasObject.toJSON();
            }else {
                ob = canvasObject;
            }
            addAliasToGroup(ob, object);
            ob.alias = object.alias;
            objects.push(ob);
        }
        canvasJson.num_Rect = num_Rect;
        canvasJson.num_Circle = num_Circle;
        canvasJson.num_Triangle =num_Triangle;
        canvasJson.num_Text = num_Text;
        canvasJson.num_Line = num_Line;
        canvasJson.num_Polygon = num_Polygon;
        canvasJson.num_Freedraw = num_Freedraw;
        canvasJson.num_Library = num_Library;
        canvasJson.num_Group = num_Group;
        canvasJson.num_Library = num_Library;
        canvasJson.objects = objects;
        canvasJson = JSON.stringify(canvasJson);
        var url = getRootPath()+"/flash/saveCanvas";
        $.ajax({
            type: 'POST',
            url: url,
            data:{canvasJson:canvasJson},
            success: function (result) {
                if (result.code == 200) {
                    var canvasJ = {};
                    canvasJ.objects = objects;
                    canvasJ.background = canvasJson.background;
                    originalCanvas = canvasJ;
                    alert("保存成功");
                }
            }
        });
    })
    //给组合的每个元素添加alias
    function addAliasToGroup(ob,object){
        if (ob.objects){
            for (var j=0;j<ob.objects.length;j++){
                ob.objects[j].alias = object._objects[j].alias;
                addAliasToGroup(ob.objects[j],object._objects[j]);
            }
        }
    }
    //删除图形
    $("#delete").click(function(){
        if (canvas.getActiveObject()) {
           deleteObject(selected);
        }
    })
    //删除图形方法
    function deleteObject(shape){
        canvas.remove(shape);
        for (var i = 0; i < moduleList.length; i++) {
            if (moduleList[i].alias == shape.alias) {
                moduleList.splice(i, 1);
                break;
            }
        }
        updateModuleList();
        canvas.renderAll();
    }
    //清空画布
    $("#deleteAll").click(function(){
        canvas.clear();
        num_Rect=0;
        num_Circle=0;
        num_Triangle= 0;
        num_Text= 0;
        num_Line= 0;
        num_Polygon= 0;
        num_Freedraw= 0;
        num_Library=0;
        num_Group = 0;
        num_Library=0;
        moduleList = new Array();
        updateModuleList();
        canvas.renderAll();
    })
    //复制图形
    $("#clone").click(function(){
        if(canvas.getActiveObject()) {
            var clone = fabric.util.object.clone(selected);
            clone.set({left: 150, top: 150});
            canvas.add(clone);
            addToModule(clone, clone.type);
            select(clone);
            canvas.renderAll();
        }
    })
    //刷新显示列表
    function refreshModule(){
        moduleList = new Array();
        var canvasJson = JSON.parse(JSON.stringify(canvas))
        var objects = canvasJson.objects;
        for(var i=0; i<objects.length;i++){
            moduleList.push(objects[i]);
        }
    }
    //上移一层
    $("#upOne").click(function(){
        if(canvas.getActiveObject()) {
            canvas.bringForward(selected);
            canvas.renderAll();
            var length = moduleList.length;
            for (var i = 0; i < length; i++) {
                if ((i + 1) == length) {
                    break;
                }
                if (moduleList[i].alias == selected.alias) {
                    if ((i + 1) == length) {
                        break;
                    }
                    var temp = moduleList[i];
                    moduleList[i] = moduleList[i + 1];
                    moduleList[i + 1] = temp;
                    break;
                }
            }
        }
    })
    //置于顶层
    $("#upTop").click(function(){
        if(canvas.getActiveObject()) {
            canvas.bringToFront(selected);
            canvas.renderAll();
            var length = moduleList.length;
            for (var i = 0; i < length; i++) {
                if ((i + 1) == length) {
                    break;
                }
                if (moduleList[i].alias == selected.alias) {
                    var temp = moduleList[i];
                    moduleList[i] = moduleList[i + 1];
                    moduleList[i + 1] = temp;
                }
            }
        }
    })
    //下移一层
    $("#downOne").click(function(){
        if (canvas.getActiveObject()) {
            canvas.sendBackwards(selected);
            canvas.renderAll();
            for (var i = 0; i < moduleList.length; i++) {
                if ((i - 1) == 0) {
                    break;
                }
                if (moduleList[i].alias == selected.alias) {
                    if ((i - 1) == 0) {
                        break;
                    }
                    var temp = moduleList[i];
                    moduleList[i] = moduleList[i - 1];
                    moduleList[i - 1] = temp;
                    break;
                }
            }
        }
    })
    //置于底层
    $("#downBottom").click(function(){
        if (canvas.getActiveObject()) {
            canvas.sendToBack(selected);
            canvas.renderAll();
            for (var i = moduleList.length - 1; i > 0; i--) {
                if ((i - 1) == 0) {
                    break;
                }
                if (moduleList[i].alias == selected.alias) {
                    if ((i - 1) == 0) {
                        break;
                    }
                    var temp = moduleList[i];
                    moduleList[i] = moduleList[i - 1];
                    moduleList[i - 1] = temp;
                }
            }
        }
    })
    //导出图片
    $("#importImage").click(function(){
        var image = canvas.toDataURL();
        console.log(image);
    })
    //吧选中图形赋值给selected
    //canvas.on('mouse:down', function() {
    //    //activeObject = canvas.getActiveObject();
    //    //if (activeObject){
    //    //    selected = activeObject;
    //    //    updateLookHandle();
    //    //}
    //    select(canvas.getActiveObject())
    //});
    canvas.on('mouse:up', function() {
        if (canvas.getActiveObject()) {
            select(canvas.getActiveObject());
        }
    });
    //canvas.on({
    //    'object:moving': select(canvas.getActiveObject()),
    //    'object:scaling': select(canvas.getActiveObject()),
    //    'object:resizing': select(canvas.getActiveObject()),
    //    'object:rotating': select(canvas.getActiveObject())
    //});
    $("#load").click(function(){
        canvas.add( new fabric.Polygon(
            [
                {x: 50, y: 0},
                {x: 100, y: 100},
                {x: 50, y: 200},
                {x: 0, y: 100}
            ],{
                fill: 'red',
                left:100,
                top:100
            }));
    })
    //组合图形
    $("#groups").click(function(){
        var activeGroup = canvas.getActiveGroup()._objects;
        var objects = new Array();
        var _leftObject = activeGroup[0];
        var _topObject = activeGroup[0];
        var _rightObject = activeGroup[0];
        var _bottomObject = activeGroup[0];
        for (var i= 0;i<activeGroup.length;i++){
            if (activeGroup[i].originalLeft<_leftObject.originalLeft){
                _leftObject = activeGroup[i];
            }
            if (activeGroup[i].originalLeft>_rightObject.originalLeft){
                _rightObject = activeGroup[i];
            }
            if (activeGroup[i].originalTop<_topObject.originalTop){
                _topObject = activeGroup[i];
            }
            if (activeGroup[i].originalTop>_bottomObject.originalTop){
                _bottomObject = activeGroup[i];
            }
            objects.push(activeGroup[i]);
            canvas.remove(activeGroup[i]);
            deleteObject(activeGroup[i]);
        }
        var _left = (_rightObject.originalLeft+_leftObject.originalLeft-_rightObject.width/2+_leftObject.width/2)/2 ;
        var _top = (_bottomObject.originalTop+_topObject.originalTop-_topObject.height/2+_bottomObject.height/2)/2;
        var group = new fabric.Group(objects,{left:_left,top:_top,originX: 'center', originY: 'center'});
        group.selectable = true;
        canvas.setActiveObject(group);
        canvas.add(group);
        num_Group++;
        addToModuleList(group,num_Group,"group");
        canvas.renderAll();
    })

    $(".importShape").click(function(){
        var url = getRootPath()+"/flash/getShape";
        var shapeCode = $(this).attr("id");
        $.ajax({
            type: 'POST',
            url: url,
            data:{code: shapeCode},
            success: function (result) {
                if (result.code==200){
                    var json = JSON.parse(JSON.stringify(canvas));
                    var ob = json.objects;
                    var library = result.data;
                    var shape = JSON.parse(library).objects;
                    num_Library++;
                    shape[0].alias = "library"+num_Library;
                    for(var i=0;i<shape.length;i++){
                        ob.push(shape[i]);
                    }
                    json.objects=ob;
                    canvas.loadFromJSON(JSON.stringify(json));
                    
                    canvas.renderAll();
                    addToModuleList(shape,num_Library,"library");
                    $("#library").modal('toggle');
                }
            }
        });
    });
    //动态添加的元素需要用父元素绑定事件
    $("#module").on("click","a",function(){
        $('#module > a').each(function () {
            $(this).attr("class","list-group-item list-group-item-info");
        });
        $(this).attr("class","list-group-item list-group-item-info active");
        var name = $(this).html();
        var shape = getShapeByName(moduleList,name,canvas);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        select(shape);
    });
    //添加动画
    $("#animation_add").click(function(){
        if (!canvas.getActiveObject()){
            alert("请选择一个对象");
        }else {
            var startTime = parseFloat($("#animation_startTime").val());
            var endTime = parseFloat($("#animation_endTime").val());
            if (startTime<0 || endTime<0){
                alert("开始时间或结束时间不能小于0");
                return;
            }
            if (endTime<=startTime){
                alert("开始时间不能小于等于结束时间");
                return;
            }
            if (endTime>maxTime/1000){
                maxTime = endTime*1000;
            }
            var animation ={shape:null,left:0,top:0,startTime:0,endTime:0,angle:0,opacity:0,easing:null};
            animation.shape = selected.alias;
            animation.left = $("#animation_left2").val();
            animation.top = $("#animation_top2").val();
            animation.angle = $("#animation_angle2").val();
            animation.opacity = $("#animation_opacity2").val();
            animation.startTime = startTime*1000;
            animation.endTime = endTime*1000;
            animation.easing = $("#animation_easing").val();
            animation.width = $("#animation_width2").val();
            animation.height = $("#animation_height2").val();
            addToanimationList(animation);
            var flashContent = {};
            flashContent.animationList = animationList;
            flashContent.maxTime = maxTime;
            flashContent = JSON.stringify(flashContent);
            $.ajax({
                type: 'POST',
                url: getRootPath()+"/flash/saveFlash",
                data:{flashContent: flashContent},
                success: function (result) {
                    //alert("添加成功");
                }
            });
        }
    });
    $("#animationList").on("click","i",function(){
        var index = $(this).attr("index");
        animationList.splice(index,1);
        var animations = document.getElementById("animationList");
        var flashContent = {};
        flashContent.animationList = animationList;
        flashContent.maxTime = maxTime;
        flashContent = JSON.stringify(flashContent);
        reflashAnimationList(animationList);
        $.ajax({
            type: 'POST',
            url: getRootPath()+"/flash/saveFlash",
            data:{flashContent: flashContent},
            success: function (result) {
                //alert("删除成功");
            }
        });
    });
    function addToanimationList(animation) {
        innerhtml=animation.shape+"/"+animation.startTime/1000+"s-"+animation.endTime/1000+"s";
        var animations = document.getElementById("animationList");
        $('#animationList > a').each(function () {
            $(this).attr("class","list-group-item list-group-item-info");
        });
        var a = document.createElement("a");
        a.href = "javascript:void(0);";
        a.setAttribute("class", "list-group-item list-group-item-info active");
        a.setAttribute("name","animationList");
        a.innerHTML = innerhtml;
        var i = document.createElement("i");
        i.setAttribute("class","iconfont btn");
        i.setAttribute("index",animationList.length);
        i.setAttribute("name","deleteAnimation");
        i.innerHTML = "&#xe615;";
        animations.appendChild(a);
        animations.appendChild(i);
        animationList.push(animation);
        return a;
    }
    //开始动画
    var startAnm;
    $("#animation_start").click(function(){
        loadCanvas();
        startAnm = setInterval(function(){startAnimation()},1000);
    });
    function startAnimation(){
        if (timeNum>maxTime){
            clearInterval(startAnm);
            timeNum=0;
            return;
        }
        timeNum+=1000;
        for (var i=0;i<animationList.length;i++){
            var animation = animationList[i];
            if (timeNum-1000==animation.startTime){
                var shape = getShapeByName(moduleList,animation.shape,canvas);
                if (!shape){
                    continue;
                }
                animations(shape,animation);
            }
        }
    }
    function animations(shape,animation){
        shape.animate('left', animation.left, {
            duration: animation.endTime-animation.startTime,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function() {

            },
            easing: fabric.util.ease[animation.easing]
        });
        shape.animate('top', animation.top, {
            duration: animation.endTime-animation.startTime,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function() {

            },
            easing: fabric.util.ease[animation.easing]
        });
        shape.animate('angle', animation.angle, {
            duration: animation.endTime-animation.startTime,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function() {

            },
            easing: fabric.util.ease[animation.easing]
        });
        shape.animate('opacity', animation.opacity, {
            duration: animation.endTime-animation.startTime,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function() {

            },
            easing: fabric.util.ease[animation.easing]
        });
        shape.animate('width', animation.width/shape.scaleX, {
            duration: animation.endTime-animation.startTime,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function() {

            },
            easing: fabric.util.ease[animation.easing]
        });
        shape.animate('height', animation.height/shape.scaleY, {
            duration: animation.endTime-animation.startTime,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function() {

            },
            easing: fabric.util.ease[animation.easing]
        });
    }
    //加载初始状态
    $("#loadOriginal").click(function(){
        loadCanvas();
    });
};
