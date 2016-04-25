/**
 * Created by Administrator on 2015/6/27.
 */
function getRootPath() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName == "") {
        return window.location.protocol + '//' + window.location.host;
    }
    else {
        return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
}

function getShapeByName(moduleList,name,canvas){
    for(var i=0;i<moduleList.length;i++){
        if (name == moduleList[i].alias){
            if ( moduleList[i].canvas){
                return moduleList[i];
            }else {
                return getShapeFromCanvasByIndex(canvas,i);
            }
        }
    }
}

function getShapeFromCanvasByIndex(canvas,index){
    return canvas._objects[index];
}
