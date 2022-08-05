var xml = new XMLHttpRequest();
xml.open("POST", "http://localhost:9091/data?query=query{user(id:1){firstName}}");
xml.send("hello");

xml.addEventListener("load", function() {
    console.log(JSON.parse(this.responseText))
})