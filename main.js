var app = new Vue({
  el: '#app',
  data: {
    msg: 'Hello Vue!',
    updates: [],
    log: []
  }
})

// Qiita: https://qiita.com/coa00/items/679b0b5c7c468698d53f
function getUniqueStr(myStrong){
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}

function appendNotify(text) {
    app.log.push({class: 'notify', text: text, id: getUniqueStr()})
}

function appendOutput(cls,name, state, id) {
    switch (state) {
        case "Zaisitu"       : state = "在室";     break
        case "Gakunai"       : state = "学内";     break
        case "IchijiTaisitu" : state = "一時退室"; break
        case "Kitaku"        : state = "帰宅";     break
    }
    let d = new Date()
    let now = d.getHours() + ':' + d.getMinutes() + '\'' + d.getSeconds()

    app.updates.push(
        {notify: false, id: id, name: name, state: state, time: now})

    app.log.push(
        {notify: false, id: id, text: name+'  -  '+state+'  -  '+now})
}

let ws = new WebSocket('ws://localhost:8000/websocket/')
appendNotify('Opening WebSockets connection...\n')

ws.onerror = function(event) {
    appendNotify('WebSockets error: ' + event.data + '\n')
}

ws.onopen = function() {
    appendNotify('WebSockets connection successful!\n')
}

ws.onclose = function(error) {
    appendNotify('WebSockets connection closed.\n')
    location.reload()
}

ws.onmessage = function(event) {
    // console.log(event.data)
    states = JSON.parse(event.data)
    states.forEach((state) => 
        appendOutput('', state.name, state.state))
}


