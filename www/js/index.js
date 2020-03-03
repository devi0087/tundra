let app= {
    people:[],
    favourite: [],
    imgURL: null,
    Key: "personinfo",
     touch : {xstart:null, xend:null, dir:null},
    init:()=>{
        app.dataFetch();
        let div = document.querySelector('div');
div.addEventListener('touchstart', app.start);
div.addEventListener('touchmove', app.move);
div.addEventListener('touchend', app.end);
div.addEventListener('touchcancel', app.cancel);
document.getElementById('fab').addEventListener('click', app.saveImage);
document.getElementById('Home').addEventListener('click', app.setImage);

    },

    dataFetch:()=>{
        
        
        let URL = "https://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female";

        fetch(URL)
                    .then(response => {
                        return response.json();
                    })
                    .then(person => {
                        console.log(person);
                        app.people = app.people.concat(person.profiles);
                        console.log(person.imgBaseURL);
                        let imgurl = decodeURIComponent(person.imgBaseURL);
                        console.log(imgurl);
                        app.imgURL = imgurl;
                        app.display();
                        
                    })
                    .catch(err => {
                        console.error(err);
                    })

    },

    display: ()=>{
        
        console.log(app.people[0]);
        let profile = app.people[0];

        let photosrc = "https://"+app.imgURL + profile.avatar;
        console.log(photosrc);

        let img = document.createElement('img');
        img.setAttribute('src', photosrc);

        let p = document.createElement('p');
        p.textContent = profile.first + " " + profile.last;

        document.querySelector('div').innerHTML = " ";
        document.querySelector('div').classList.remove('left');
        document.querySelector('div').classList.remove('right');
        document.querySelector('div').appendChild(img);
        document.querySelector('div').appendChild(p);
    },
    



start:(ev)=>{
    console.log(ev);
    app.touch.xstart = ev.touches[0].clientX;
},
move:(ev)=>{
    console.log(ev);
    app.touch.xend = ev.touches[0].clientX;
},
end:(ev)=>{
    console.log(ev);
    let deltaX = app.touch.xend - app.touch.xstart;
    console.log(deltaX);
    if (deltaX > 0){
        // what about minimum distance travelled
        //what about moving more in vertical than horizontal
        // what about min or max time to move
        app.touch.dir = "right";
    
    }else{
        app.touch.dir = "left";
    }
    if(app.touch.dir != null){
       
        console.log(ev.target);
        console.log(app.touch.dir);
        document.querySelector('div').classList.add(app.touch.dir);
        console.log(app.people);
        setTimeout(function(){if(app.touch.dir == "left"){
            app.people.shift(0);
            
            app.display();
            if(app.people.length<2){
                app.dataFetch();
            }
        }else if(app.touch.dir == "right"){
             app.favourite = app.favourite.concat(app.people[0]);
                let star = JSON.stringify(app.favourite);
                sessionStorage.setItem(app.Key,star) ;
                
    
        
            app.people.shift(0);
            app.display();
            if(app.people.length<2){
                app.dataFetch();
            }
        }},500);

        
    
       /*
        document.querySelector('div').classList.add(app.touch.dir);
       
        
        let ul = document.querySelector('.peoplelist');
        ul.innerHTML = "";
        let imageId = Date.now();
        let name = document.getElementById('name').value;
        let rate = parseInt(document.querySelector('.stars').getAttribute('other details'));
        let img = document.getElementById('imgAdd').src;
    
        let sign = [{ "id":imageId, "name": name, "details": otherdetails, "img": img}];
        app.person = person;
    
        app.sign = app.people.concat(sign);
    console.log(sign);
    // }*/
}

    
    
},

cancel:(ev)=>{
        console.log(ev);
       app.touch.xstart = null;
        app.touch.xend = null;
        app.touch.dir = null;

    },

    saveImage:()=>{
        document.querySelector('.home').classList.remove('active');
        document.querySelector('.home').classList.add('inactive');
        document.getElementById('fav').classList.remove('inactive');
        document.getElementById('fav').classList.add('active');
        console.log('save');
        let str = sessionStorage.getItem(app.Key);
        let obj = JSON.parse(str);
        console.log(obj);
        let div = document.createElement('div');
        for (let i = 0; i < obj.length; i++) {
        let pic = "https:"+app.imgURL + obj[i].avatar;
       
        let img = document.createElement('img');
        let btn = document.createElement("BUTTON");
        btn.textContent = "Delete";
         
        img.setAttribute('src', pic);
        btn.setAttribute('data-id',obj[i]);
        let p = document.createElement('p');
        p.textContent = obj[i].first + " " + obj[i].last;

        div.appendChild(img);
        div.appendChild(p);
        div.appendChild(btn);
        btn.addEventListener('click', app.Delete);
        } 
        document.getElementById('fav').innerHTML = " "; 
        document.getElementById('fav').appendChild(div);
    },
    setImage:()=>{
        console.log('hi');
        document.querySelector('.home').classList.remove('inactive');
        document.querySelector('.home').classList.add('active');
        document.getElementById('fav').classList.remove('active');
        document.getElementById('fav').classList.add('inactive'); 
        app.dataFetch();
    },
    Delete:(ev)=>{
        let currentPage = ev.currentTarget.getAttribute('data-id');
        app.favourite.forEach((element,index) =>{
            console.log(currentPage);
            console.log(index)
            if(element.id==currentPage){
                console.log(app.favourite);  
            app.favourite.splice(index, 1);
            console.log(app.favourite);
        };
        let value =JSON.stringify(app.favourite);
        sessionStorage.setItem(app.Key, value);
             
             app.saveImage();
        });
             //JSON.parse( sessionStorage.getItem(app.Key));
           
             
            
               
    }

    


}

let ready = ('cordova' in window) ? "deviceready":"DOMContentLoaded";
document.addEventListener(ready, app.init);