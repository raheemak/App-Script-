var sheet = SpreadsheetApp.getActiveSheet();
var folder = DriveApp.getFolderById("***");
var numiterations=0;
var first = true;
var rootEditors=[];
var root =true;

function main(){   
  var viewers = folder.getViewers();
  format (viewers,0,"",0);
  var editors = folder.getEditors();
  format (editors,1,"",0);  
  
  var folders = folder.getFolders();
  var curr,curr2;
  var info= [];
  numiterations++;
  first = false;
  while (folders.hasNext()){
    curr = folders.next();
    viewers = curr.getViewers();
    format (viewers,2,curr.getName(),numiterations);
    editors = curr.getEditors();
    format (editors,1,curr.getName(),numiterations); 
    /*  if (curr.getFolders().hasNext()){
    curr2 = curr.getFolders().next();
    viewers = curr2.getViewers();
    format (viewers,2,curr2.getName(),numiterations+1);
    editors = curr2.getEditors();
    format (editors,1,curr2.getName(),numiterations+1); 
    }*/
    
    if (first)
      first = false;
    else 
      first = true;
  }
}

function format(base,type,name,tabs){
  var pushed = false;
  var color;
  var arr =[];
  for (user in base)
    arr.push(base[user].getEmail());
  var line=[];
  
  if (type==0){
    line.push ("Root: ");
    line.push ("Viewers: ");
    for (var x = 0 ; x < tabs ; x++)
      line.push ("");
    color = "#cfe2f3";
  }
  else if (type==1){
    for (var x = 0 ; x < tabs ; x++)
      line.push ("");
    line.push ("");    
    line.push ("Editors: ");
    if (first)
      color ="#9fc5e8";
    else 
      color = "#fff2cc"
  }
  else{
    for (var x = 0 ; x < tabs ; x++)
      line.push ("");
    line.push (name);
    line.push ("Viewers: ");
    if (first)
      color = "#cfe2f3";
    else
      color = "#ffe599"
  }
  
  var y =0;
  for (var x =0 ; x<arr.length; x++){
    Logger.log (y);
    if ((x%(7-tabs) == 0 )&& y !=0){
      sheet.appendRow(line);
      sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn()).setBackground(color)
      line = [];
      line.push("");
      line.push("");
      pushed = true;
    }
    else{
      //    Logger.log (arr[x]);
      if (!root && rootEditors.indexOf(arr[x])==-1 && type==1){
        // Logger.log (arr[x] + ": " + rootEditors.indexOf (arr[x]));
        line.push (arr[x]);
     //   y++;
      }
      else if (root && type==1){
        //      Logger.log ("pushin");
        line.push (arr[x]);
        rootEditors.push(arr[x]); 
  //      y++;
      }
      else if (type==2 || type==0){
        line.push(arr[x]);
   //     y++;
      }
    }

  }
  if(!pushed){
    sheet.appendRow(line);
    sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn()).setBackground(color)
  };
  
  if (root && type==1)
    root = false;
}

