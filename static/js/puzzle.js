let dragging;
let dropped;
let space = [];
let currentPic = 0;


function custom_init(){

    document.getElementById("next-button").hidden=true

    document.getElementById("original-img").src=`../static/images/${currentPic}/original.jpg`

    if (currentPic !== 0){
        for (let i = 0; i < 25; i++){
            let xid = (currentPic - 1).toString() + "image" + i.toString();
            document.getElementById(xid).remove();
        }
    }
    space = []
    for (let i = 0; i < 25; i++){
            document.getElementById("blank-" + i.toString()).addEventListener("dragenter", dragEnter);
            document.getElementById("blank-" + i.toString()).addEventListener("dragover", dragOver);
            document.getElementById("blank-" + i.toString()).addEventListener("drop", dragDrop);
            space.push(-1);
    }
    let locations = [];
    for (let i = 0; i < 25; i++){
        locations.push(i.toString());
    }
    // for (let i = 0; i < 25; i++){
    //     let randloc = Math.floor(Math.random() * 25);
    //     let swp = locations[randloc]
    //     locations[randloc] = locations[i];
    //     locations[i] = swp;
    // }
    for (let i = 0; i < 25; i++){
        appendImgToPuzzlePieces(locations[i]);
    }

    let img_demo_url = "../static/images/" + currentPic.toString() + '/' +  locations[0] + ".jpg"

    let img_demo = new Image()
    img_demo.src = img_demo_url
    img_demo.onload = function (){
        let rat = 100 * img_demo.height / img_demo.width
        let hdl = document.getElementsByClassName("ratio")
        for (let idx = 0; idx < 25; idx++){
            hdl[idx].style.cssText=`--bs-aspect-ratio:${rat}%; width:${img_demo.width}px; height:${img_demo.height}px;`
        }
    }
}

window.addEventListener("load", custom_init)


function appendImgToPuzzlePieces(i){
    let imgsrc = "../static/images/" + currentPic.toString() + '/' + i + ".jpg"
    let img = document.createElement("img");
    img.src = imgsrc;
    img.id = currentPic.toString() + "image" + i;
    document.getElementById("puzzle-pieces").append(img);
    img.addEventListener("dragstart", dragStart); //click on image to drag
    img.addEventListener("dragleave", dragLeave); //dragging an image away from another one
    img.addEventListener("drop", dragDrop);       //drop an image onto another one
    img.addEventListener("dragend", dragEnd);      //after you completed dragDrop
}

function dragStart(){
    dragging = this;
}

function dragOver(e){
    e.preventDefault();
}

function dragEnter(e){
    e.preventDefault();
}

function dragLeave(){

}

function dragDrop(){
    dropped = this;
}

function dragEnd(){
    if (dropped == null){
        return;
    }
    let destsrc = dropped.src;
    let dest = dropped.id;

    let imgstr = dragging.src.slice(-6);
    let imgnum; // dragging image number
    if (imgstr[0] === '/'){
        imgnum = parseInt(imgstr[1]);
    }
    else{
        imgnum =  parseInt(imgstr.slice(0,2));
    }
    
    let deststr = dest.slice(-2);
    let destnum; //destination blank number

    if (deststr[0] === '-'){
        destnum = parseInt(deststr[1]);
    }
    else{
        destnum = parseInt(deststr);
    }
    if (space[destnum] !== -1){
        let draggingimg;
        let found = -1; //dragging image orginal blank number
        for (let i = 0; i < 25; i++){
            if (space[i] === imgnum){
                found = i;
                break;
            }
        }
        if (found === -1){ //dragging image comes from puzzle-pieces
            appendImgToPuzzlePieces(space[destnum].toString());
            let oriimg = space[destnum].toString(); //original image in the desetination blank
            let element = document.getElementById(currentPic.toString() + "image" + oriimg);
            element.remove();
            space[destnum] = imgnum;
            document.getElementById(dest).append(dragging);

        }
        else{ //found, in some blank
            space[found] = space[destnum]; //original destination blank image number
            let imgid = currentPic.toString() + "image" + space[found].toString();
            let element = document.getElementById(imgid);
            space[destnum] = imgnum;
            document.getElementById(dest).append(dragging);
            document.getElementById("blank-" + found.toString()).append(element);
        }
        
    }
    else{ 
        document.getElementById(dest).append(dragging);
        for (let i = 0; i < 25; i++){
            if (space[i] === imgnum){
                space[i] = -1;
                break;
            }
        }
        space[destnum] = imgnum;

    }
    
    dropped = null
    for (let i = 0; i < 1; i++){
        if (space[i] !== i){
            return;
        }
    }

    if (currentPic < 2){
        document.getElementById("next-button").hidden=false
    }

    if (currentPic === 2){
        let myModal = new bootstrap.Modal(document.getElementById('congrats-modal'), {
            keyboard: false
        })
        myModal.show()
        document.getElementById("restart-button").hidden=false
    }
    currentPic ++;
}