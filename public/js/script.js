const main = document.querySelector('main');
const url = location.pathname;
document.addEventListener('DOMContentLoaded',async () => {
    await LoadHeader_Footer();
    await LoadPage(main,url);
    await InitAccessbility['header']();
    if(InitAccessbility[url]){
        await InitAccessbility[url]();
    }
})
async function LoadHeader_Footer(){
    try{
        let response = await fetch('/api/theme',{
            method:"GET"
        })
        let jsonData = await response.json();
        let header = jsonData.header;
        let footer = jsonData.footer;
        let root = jsonData.root;
        await LoadHeader_FooterContent(header,footer,root);
    }catch(err){
        console.log(err);
    }
}
async function LoadHeader_FooterContent(headerData,footerData,root){
    LoadRootData(JSON.parse(root));
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    header.innerHTML = headerData.data;
    footer.innerHTML = footerData.data;
    const header_data = headerData.content;
    const footer_data = footerData.content;
    await LoadPageContent(header,header_data)
    await LoadPageContent(footer,footer_data)
    
}
async function LoadPage(container,url){
    try{
        let response = await fetch("api",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({url:url})
        })
        let json = await response.json();
        LoadPageContent(container,json.data);
    }catch(err){
        console.log(err);
        Load404Page();
    }
}
async function LoadProjects({url,items = [],instance,container}){
    try{
        let response = await fetch("api/item",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({url:url})
        })
        let json = await response.json();
        let data = JSON.parse(json.data);
        container.innerHTML = '';
        items.forEach(async item => {
            const jsonItem = data[item]
            if(jsonItem)
                await LoadProject(jsonItem,instance,container);
        })
    }catch(err){
        console.log(err);
    }
}
async function LoadProject(item,instance,container,data){
    try{
        let response = await fetch("api/html",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({url:instance})
        })
        let json = await response.text();
        const project = document.createElement('div');
        project.innerHTML = json;
        project.classList.add("project-item")
        container.appendChild(project);
        LoadProjectContent(project,item);
    }catch(err){
        console.log(err);
    }
}
function LoadProjectContent(element,json){      
    LoadPageContent(element,JSON.stringify(json));
}
function LoadPageContent(container,json){
    let data = JSON.parse(json);
    const elements = container.querySelectorAll('[data-content]');  
    elements.forEach(element => {
        let jsonData = data[element.getAttribute('data-content')]
        if(jsonData)
            LoadElement(element,jsonData);
    })
}
function LoadRootData(root){
    for(const [key,value] of Object.entries(root))
        document.documentElement.style.setProperty(key,value)
}
function LoadElement(element,json){
    const type = json.type || 'none';
    switch(type){
        case 'text':
            let textContent = json.textContent || "Demo";
            element.innerHTML = textContent;
        break;
        case 'image':
            element.src = json.src || 'images/room-header-mobile.webp';
            element.width = json.width || 100;
            element.height = json.height || 100;
            element.alt = json.alt || 'Demo';
            element.title = json.alt || 'Demo';
            element.loading = json.loading || 'lazy'
        break
        case 'projects':
            let items = json.items;
            let instance = json.instance || '/item/project.html';
            let src = json.src || "/projects/projects.json"
            LoadProjects({
                url: src,
                items: items,
                instance: instance,
                container: element
            });
        break
        case 'none':

        break;
        default:

        break;
    }
    const attrs = json.attrs || {};
    for(const [key,value] of Object.entries(attrs)){
        if(key === 'class')
        {
            const classElements = value.split(' ');
            classElements.forEach(classElement => element.classList.add(classElement))
        }
        else
        {
            element.setAttribute(key,value);
        }
    }
}
function Load404Page(){
  window.location.href = '/404';
}
const InitAccessbility = {
    "header":async function(){
        const header_nav_links = document.getElementById('header_nav_links');
        document.querySelectorAll('.header-toggle').forEach(header_toggle => {
            header_toggle.addEventListener('click',() => {
                header_nav_links.classList.toggle('show');
            })
        });
    },
    "/":async function(){
        document.querySelectorAll('.Accordion').forEach(accordion => {globalBlocks.accordion(accordion)})
    }
}


const globalBlocks = {
    accordion: function(block){
        block.querySelectorAll('.Accordion-item').forEach(item => {
            const header = item.querySelectorAll('div')[0];
            const triggerIcon = header.querySelectorAll('*')[1];
            const content = item.querySelectorAll('div')[1];
            content.style.height = '0px';
            content.style.marginTop = '0px';
            item.classList.add('cursor-pointer');
            item.addEventListener('click',() => {
                let IsOpen = content.style.height == '0px'
                if(triggerIcon){triggerIcon.style.transform = IsOpen ? "rotate(45deg)" : "rotate(0deg)"}
                content.style.marginTop = IsOpen ? '1rem' : '0px'
                content.style.height = IsOpen ? content.scrollHeight + 'px' : '0px'
            })
        })
    },
    tab_header: function(block){
        const tab_items = block.querySelector('.tab_items')
        const tab_item = tab_items.querySelectorAll('[data-tab]');
        const tab_items_input = block.querySelector('.tab_items_input')
        const tab_items_input_button = tab_items_input.querySelectorAll('.tab_item')
        const displaytabItem = (item,display) => {(display) ? item.classList.remove('display-none') : item.classList.add('display-none')}
        const displaytabInput = (item,display) => {(display) ? item.classList.add('active') : item.classList.remove('active')}
        const displayNoneAll = () => {tab_item.forEach(item => displaytabItem(item,false));tab_items_input_button.forEach(item => displaytabInput(item,false))};
        displayNoneAll();
        displaytabItem(tab_item[0],true)
        displaytabInput(tab_items_input_button[0],true)
        tab_items_input_button.forEach(tab_item_button => {
            tab_item_button.addEventListener('click',() => {
                displayNoneAll();
                let id = tab_item_button.getAttribute('data-tab')
                displaytabInput(tab_item_button,true);
                tab_item.forEach(item => {if(item.getAttribute('data-tab') == id){displaytabItem(item,true)}})
            })
        })
    }
}