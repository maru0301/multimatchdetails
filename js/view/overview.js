////////////////////////////////////////////////////////////////////////////////////
// OverView Class
////////////////////////////////////////////////////////////////////////////////////

class OverView {

	constructor()
	{
		this.Data = new Array();
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Init
	////////////////////////////////////////////////////////////////////////////////////

	Init()
	{
		this.InitData();
	}

	InitData()
	{
		this.InitMatch();

		this.ShowMatch(this.Data);
/*
		this.ShowPick(this.Data.BanPick.Picks);
		this.ShowBan(this.Data.BanPick.Bans);
*/
	}

	InitMatch()
	{
		console.log(matchdetail.MATCHLIST);

		var Match = new Array();

		for(var i = 0 ; i < matchdetail.MATCHLIST.length ; ++i)
		{
			Match[i] = {};
			Match[i].teams = new Array();

			for(var j = 0 ; j < matchdetail.MATCHLIST[i].teams.length ; ++j)
			{
				Match[i].teams[j] = {};

				Match[i].teams[j].teamId = matchdetail.MATCHLIST[i].teams[j].teamId;
				Match[i].teams[j].teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
				Match[i].teams[j].win = matchdetail.MATCHLIST[i].teams[j].win;

				// Stats
				Match[i].teams[j].stats = matchdetail.MATCHLIST[i].teams[j].stats;

				// Player
				Match[i].teams[j].player = matchdetail.MATCHLIST[i].teams[j].player;

				// Bans
				Match[i].teams[j].bans = new Array();
				for(var k = 0 ; k < matchdetail.MATCHLIST[i].teams[j].bans.length ; ++k)
				{
					Match[i].teams[j].bans.push(matchdetail.MATCHLIST[i].teams[j].bans[k]);
				}

				Match[i].teams[j].bans.sort(function(a,b){
					return a.pickTurn < b.pickTurn ? 0 : 1;
				});
			}
		}

		this.Data = Match;
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Show
	////////////////////////////////////////////////////////////////////////////////////

	ShowMatch(CommonData)
	{
		var target = $('.overview')[0];

		for(var i = 0 ; i < CommonData.length ; ++i)
		{
			var newSectionTag = document.createElement("section");
			var newHeaderTag = document.createElement("h1");
			
			newHeaderTag.innerHTML = "Match"+(i+1);

//			newSectionTag.appendChild(newHeaderTag);
//			target.appendChild(newSectionTag);
		}

		return;

		for(var i = 0 ; i < BansListData.length ; ++i)
		{
			var champ_img = matchdetail.GetChampionImgName(BansListData[i].championId);
			var tip = BansListData[i].championName;
			var num = BansListData[i].Nums.num;
	
			var imgTag = document.createElement("div");
			var tag = new Array();

			tag.push("<img id='champion_image' src='" + matchdetail.CDN_URL + "/" + matchdetail.VERSION + "/img/champion/" + champ_img + "' title='" + tip +"'>");
			tag.push("<p>Total : " + num + "</p>");
			tag.push("<p class='info_text'>");

			for(var j = 0 ; j < BansListData[i].Nums.length ; ++j)
			{
				var teamName = BansListData[i].Nums[j].teamTag;
				var blueNum = BansListData[i].Nums[j].blue;
				var redNum = BansListData[i].Nums[j].red;

				tag.push(teamName + " blue : "  + blueNum + " red : " + redNum + "<br/>");				
			}

			tag.push("</p>");
			
			imgTag.id = "champion_image_text";
			imgTag.innerHTML = tag.join("");

			newTag.appendChild(imgTag);
		}

		banTag.appendChild(newTag);
		banTag.innerHTML = banTag.innerHTML + "<br clear='both'/>";
	}

	ShowPick(CommonData)
	{
		$('Pick list').empty();
		
		var keys = $('[name="PickFilter"]:checked').map(function(){
			return $(this).val();
		}).get();

		var PicksListData = $.extend(true, [], CommonData);

		// フィルタ
		for(var i = 0 ; i < PicksListData.length ; ++i)
		{
			var lane = PicksListData[i].lane;
			PicksListData[i] = PicksListData[i].filter(function(value) {
				for(var i = 0 ; i < keys.length ; ++i)
				{
					if($.inArray(keys[i], value.keys) !== -1)
						return true;
				}

				return false;
			});

			PicksListData[i].lane = lane;
		}

		for(var i = 0 ; i < PicksListData.length ; ++i)
		{
			for(var j = 0 ; j < PicksListData[i].length ; ++j)
			{
				// Nums
				PicksListData[i][j].Nums = PicksListData[i][j].Nums.filter(function(value) {
					if($.inArray(value.teamTag, keys) !== -1)
						return true;
					return false;
				});
			}
		}

		// 合計
		for(var i = 0 ; i < PicksListData.length ; ++i)
		{
			for(var j = 0 ; j < PicksListData[i].length ; ++j)
			{
				var num = 0;
				var win = 0;
				for(var k = 0 ; k < PicksListData[i][j].Nums.length ; ++k)
				{
					num = PicksListData[i][j].Nums[k].blue + PicksListData[i][j].Nums[k].red + num;
					win = PicksListData[i][j].Nums[k].win + win;
				}
				PicksListData[i][j].Nums.num = num;
				PicksListData[i][j].Nums.win = win;
			}
		}

		// ソート
		for(var i = 0 ; i < PicksListData.length ; ++i)
		{
			PicksListData[i].sort(function(a, b)
			{
				if(a.Nums.num < b.Nums.num) return 1;
				if(a.Nums.num > b.Nums.num) return -1;

				if(a.Nums.num == b.Nums.num)
				{
					if(a.championName < b.championName)
						return -1;
					else
						return 1;
				}
			});
		}

		var pickTag = $('Pick list')[0];

		for(var i = 0 ; i < PicksListData.length ; ++i)
		{
			var lane = PicksListData[i].lane;
			var laneTag = document.createElement(lane);
			
			laneTag.innerHTML = "<h2><u>" + lane + "</u></h2>";
			var newTag = document.createElement("div");
			
			for(var j = 0 ; j < PicksListData[i].length ; ++j)
			{
				var champ_img = matchdetail.GetChampionImgName(PicksListData[i][j].championId);
				var tip = PicksListData[i][j].championName;
				var num = PicksListData[i][j].Nums.num;
				var winRate = (PicksListData[i][j].Nums.win / PicksListData[i][j].Nums.num) * 10000;
				winRate = Math.round(winRate) / 100;

				var imgTag = document.createElement("div");
				var tag = new Array();

				tag.push("<img id='champion_image' src='" + matchdetail.CDN_URL + "/" + matchdetail.VERSION + "/img/champion/" + champ_img + "' title='" + tip +"'>");
				tag.push("<p>WinRate : " + winRate + "%</p>");
				tag.push("<p>Total Pick Num : " + num + "</p>");
				tag.push("<p class='info_text'>");
	
				for(var k = 0 ; k < PicksListData[i][j].Nums.length ; ++k)
				{
					var teamName = PicksListData[i][j].Nums[k].teamTag;
					var blueNum = PicksListData[i][j].Nums[k].blue;
					var redNum = PicksListData[i][j].Nums[k].red;
	
					tag.push(teamName + " blue : "  + blueNum + " red : " + redNum + "<br/>");				
				}
	
				tag.push("</p>");
				
				imgTag.id = "champion_image_text";
				imgTag.innerHTML = tag.join("");
	
				newTag.appendChild(imgTag);
			}

			laneTag.appendChild(newTag);
			pickTag.appendChild(laneTag);
			pickTag.innerHTML = pickTag.innerHTML + "<br clear='both'/>";
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////

function UpdateBan()
{
	view.ShowBan(view.Data.BanPick.Bans);
}

function UpdatePick()
{
	view.ShowPick(view.Data.BanPick.Picks);
}

////////////////////////////////////////////////////////////////////////////////////

var overview = new OverView();

