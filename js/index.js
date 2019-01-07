let URL_NUM = 0;

function CreateMatchDetail()
{
	let realmList = new Array();
	let idList = new Array();
	let hashList = new Array();
	
	for(let i = 0 ; i < URL_NUM ; ++i)
	{
		console.log(i + " : " + $("#url"+i).val());
		let url = $("#url"+i).val();

		if(url != undefined && url != "")
		{
			let index = url.search("#");
			url = url.substr(index);
			index = url.search("/");
			url = url.substr(index+1);
			index = url.search("/");

			realmList.push(url.substr(0, index));

			url = url.substr(index+1);
			const isGameHash = url.search('gameHash') != -1;

			if( isGameHash )
				index = url.search('[\?]');
			else
				index = url.search("/");
			
			idList.push(url.substr(0, index));

			url = url.substr(index+1);

			if( isGameHash )
			{
				index = url.search('=');
				url = url.substr(index+1);
				index = url.search('&');
			}
			else
			{
				index = url.search('[\?]');
			}

			if( index != -1 )
				url = url.substr(0, index);

			hashList.push(url);
		}

	}

	console.log("realmList : " + realmList);
	console.log("idList : " + idList);
	console.log("hashList : " + hashList);

	let url_data = "";

	for(let i = 0 ; i < realmList.length ; ++i)
	{
		url_data = url_data + realmList[i] + "," + idList[i] + "," + hashList[i];

		if(i < realmList.length-1)
		{
			url_data = url_data + "&";
		}
	}

	location.href = "view.html?data="+encodeURIComponent(realmList.length + "&" + url_data);
}

function CreateURLForm()
{
	let target = document.getElementById("url_list");
	let newTag;

	newTag = document.createElement("div");

	let tag = new Array();

	tag.push("URL" + (URL_NUM + 1) + " : " + "<input type=\"input\" style=\"width:80%\" id=\"url" + URL_NUM + "\">");
	newTag.innerHTML = tag.join("");

	target.appendChild(newTag);

	URL_NUM++;
}

function Init()
{
	$(document).ready( function(){
		CreateURLForm();
	});
}

//////////////////////////////////////////////////////////////////////////////

Init();
