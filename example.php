<script src='libjs.js'></script>
<script src='localdb/localstoragedb.js'></script>
<script src='localdb/localstoragedb.min.js'></script>

<script>

session = new jssession().init();


function set(){
	session.set("name",'mamji')
}

function get(){
	alert(session.get("name"))
}

function unset(){
	session.unset("name")
}

function destroy(){
	session.destroy()
}

</scirpt>
