////////////////////////////////////////////////////////////////////////////////////
// View Class
////////////////////////////////////////////////////////////////////////////////////

class View {

	constructor()
	{
		this.Data = {};

		// BanPick
		this.Data.BanPick = {};
		this.Data.BanPick.Bans = new Array();
		this.Data.BanPick.Picks = new Array();
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Init
	////////////////////////////////////////////////////////////////////////////////////

	Init()
	{
		console.log("View.Init");

		this.InitBanPick();

		this.ShowPick();
		this.ShowBan(this.Data.BanPick.Bans);
	}

	InitBanPick()
	{
		this.InitPick();
		this.InitBanData();

		this.InitBanFilter();		
	}

	InitBanData()
	{
		for(var i = 0 ; i < matchdetail.MATCHLIST.length ; ++i)
		{
			for(var j = 0 ; j < matchdetail.MATCHLIST[i].teams.length ; ++ j)
			{
				for(var k = 0 ; k < matchdetail.MATCHLIST[i].teams[j].bans.length ; ++k)
				{
					var isSet = false;
					for(var l = 0 ; l < this.Data.BanPick.Bans.length ; ++l)
					{
						if(this.Data.BanPick.Bans[l].championId == matchdetail.MATCHLIST[i].teams[j].bans[k].championId)
						{
							isSet = true;

							var teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
							var isNum = false;
							// Num
							for(var m = 0 ; m < this.Data.BanPick.Bans[l].Nums.length ; ++m)
							{
								if(this.Data.BanPick.Bans[l].Nums[m].teamTag == teamTag)
								{
									isNum = true;

									if(matchdetail.MATCHLIST[i].teams[j].teamId == 100)
										this.Data.BanPick.Bans[l].Nums[m].blue++;
									else
										this.Data.BanPick.Bans[l].Nums[m].red++;
									
									break;
								}
							}

							if(!isNum)
							{
								var num_index = this.Data.BanPick.Bans[l].Nums.length;

								this.Data.BanPick.Bans[l].Nums[num_index] = {};
								this.Data.BanPick.Bans[l].Nums[num_index].teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
								this.Data.BanPick.Bans[l].Nums[num_index].blue = 0;
								this.Data.BanPick.Bans[l].Nums[num_index].red = 0;
								
								if(matchdetail.MATCHLIST[i].teams[j].teamId == 100)
									this.Data.BanPick.Bans[l].Nums[num_index].blue++;
								else
									this.Data.BanPick.Bans[l].Nums[num_index].red++;
							}

							// Key
							var isKey = false;
							for(var m = 0 ; m < this.Data.BanPick.Bans[l].keys.length ; ++m)
							{
								if(this.Data.BanPick.Bans[l].keys[m] == teamTag)
								{
									isKey = true;
									break;
								}
							}

							if(!isKey)
							{
								this.Data.BanPick.Bans[l].keys.push(teamTag);
							}

							break;
						}
					}
					
					if(!isSet)
					{
						var index = this.Data.BanPick.Bans.length;

						this.Data.BanPick.Bans[index] = {};
						this.Data.BanPick.Bans[index].championId = matchdetail.MATCHLIST[i].teams[j].bans[k].championId;
						this.Data.BanPick.Bans[index].championName = matchdetail.GetChampionName(matchdetail.MATCHLIST[i].teams[j].bans[k].championId);
						this.Data.BanPick.Bans[index].keys = new Array();
						this.Data.BanPick.Bans[index].keys.push(matchdetail.MATCHLIST[i].teams[j].teamTag);

						this.Data.BanPick.Bans[index].Nums = new Array();
						var num_index = this.Data.BanPick.Bans[index].Nums.length;
						this.Data.BanPick.Bans[index].Nums[num_index] = {};
						this.Data.BanPick.Bans[index].Nums[num_index].teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
						this.Data.BanPick.Bans[index].Nums[num_index].blue = 0;
						this.Data.BanPick.Bans[index].Nums[num_index].red = 0;
						
						if(matchdetail.MATCHLIST[i].teams[j].teamId == 100)
							this.Data.BanPick.Bans[index].Nums[num_index].blue++;
						else
							this.Data.BanPick.Bans[index].Nums[num_index].red++;
					}
				}
			}
		}
	}

	InitPick()
	{
		var Lane = [ "Top" , "Jungle", "Mid", "Bot", "Support" ];

		for(var i = 0 ; i < matchdetail.MATCHLIST.length ; ++i)
		{
			for(var j = 0 ; j < matchdetail.MATCHLIST[i].teams.length ; ++ j)
			{
				for(var k = 0 ; k < matchdetail.MATCHLIST[i].teams[j].player.length ; ++k)
				{
					var isSet = false;

					if(typeof this.Data.BanPick.Picks[k] !== "undefined")
					{
						for(var l = 0 ; l < this.Data.BanPick.Picks[k].length ; ++l)
						{
							if(this.Data.BanPick.Picks[k][l].championId == matchdetail.MATCHLIST[i].teams[j].player[k].championId)
							{
								isSet = true;
								this.Data.BanPick.Picks[k][l].num++;

								break;
							}
						}
					}

					if(!isSet)
					{
						if(typeof this.Data.BanPick.Picks[k] === "undefined")
						{
							this.Data.BanPick.Picks[k] = new Array();
							this.Data.BanPick.Picks[k].lane = Lane[k];
						}

						var index = this.Data.BanPick.Picks[k].length;

						this.Data.BanPick.Picks[k][index] = {};
						this.Data.BanPick.Picks[k][index].championId = matchdetail.MATCHLIST[i].teams[j].player[k].championId;
						this.Data.BanPick.Picks[k][index].championName = matchdetail.GetChampionName(matchdetail.MATCHLIST[i].teams[j].player[k].championId);
						this.Data.BanPick.Picks[k][index].teams = new Array();
						this.Data.BanPick.Picks[k][index].teams.push(matchdetail.MATCHLIST[i].teams[j].teamTag);
						this.Data.BanPick.Picks[k][index].num = 1;
					}
				}
			}
		}

		// ソート
		for(var i = 0 ; i < this.Data.BanPick.Picks.length ; ++i)
		{
			this.Data.BanPick.Picks[i].sort(function(a, b)
			{
				if(a.num < b.num) return 1;
				if(a.num > b.num) return -1;

				if(a.num == b.num)
				{
					if(a.championName < b.championName)
						return -1;
					else
						return 1;
				}
			});
		}
	}

	InitBanFilter()
	{
		var keys = new Array();

		for(var i = 0 ; i < this.Data.BanPick.Bans.length ; ++i)
		{
			for(var j = 0 ; j < this.Data.BanPick.Bans[i].keys.length ; ++j)
			{
				if($.inArray(this.Data.BanPick.Bans[i].keys[j], keys) === -1)
				{
					keys.push(this.Data.BanPick.Bans[i].keys[j]);
				}
			}
		}

		var filterTag = $('Ban filter div')[0];
		var id_name = "";
		var text = "";

		for(var i = 0 ; i < keys.length ; ++i)
		{
			id_name = "ban_filter_" + keys[i].toLowerCase();
			text = keys[i];

			var inputTag = document.createElement("input");
			inputTag.type = "checkbox";
			inputTag.className = "filter_check_box";
			inputTag.id = id_name;
			inputTag.value = keys[i];
			inputTag.name = "BanFilter";
			inputTag.onchange = UpdateBan;
			inputTag.checked = true;

			var labelTag = document.createElement("label");
			labelTag.className = "filter_check_box_label";
			labelTag.htmlFor = id_name;
			labelTag.innerHTML = text;

			filterTag.appendChild(inputTag);
			filterTag.appendChild(labelTag);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Show
	////////////////////////////////////////////////////////////////////////////////////

	ShowBan(CommonData)
	{
		$('Ban list').empty();

		var keys = $('[name="BanFilter"]:checked').map(function(){
			return $(this).val();
		}).get();

		var BansListData = $.extend(true, [], CommonData);
		// フィルタ
		BansListData = BansListData.filter(function(value) {
			for(var i = 0 ; i < keys.length ; ++i)
			{
				if($.inArray(keys[i], value.keys) !== -1)
					return true;
			}

			return false;
		});

		for(var i = 0 ; i < BansListData.length ; ++i)
		{
			// Nums
			BansListData[i].Nums = BansListData[i].Nums.filter(function(value) {
				if($.inArray(value.teamTag, keys) !== -1)
					return true;
				return false;
			});
		}

		// 合計
		for(var i = 0 ; i < BansListData.length ; ++i)
		{
			var num = 0;
			for(var j = 0 ; j < BansListData[i].Nums.length ; ++j)
			{
				num = BansListData[i].Nums[j].blue + BansListData[i].Nums[j].red + num;
			}
			BansListData[i].Nums.num = num;
		}

		// ソート
		BansListData.sort(function(a, b)
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

		var banTag = $('Ban list')[0];

		for(var i = 0 ; i < BansListData.length ; ++i)
		{
			var champ_img = matchdetail.GetChampionImgName(BansListData[i].championId);
			var tip = BansListData[i].championName;
			var num = BansListData[i].Nums.num;
	
			var newTag = document.createElement("div");
			var imgTag = document.createElement("div");

			imgTag.id = "champion_image_text";
			imgTag.innerHTML = "<img id='champion_image' src='" + matchdetail.CDN_URL + "/" + matchdetail.VERSION + "/img/champion/" + champ_img + "' title='" + tip +"'><p>" + num + "</p>";
			imgTag.className = "";

			newTag.appendChild(imgTag);
			banTag.appendChild(newTag);
		}

		banTag.innerHTML = banTag.innerHTML + "<br clear='both'/>";
	}

	ShowPick()
	{
		var pickTag = $('Pick list')[0];

		for(var i = 0 ; i < this.Data.BanPick.Picks.length ; ++i)
		{
			var lane = this.Data.BanPick.Picks[i].lane;
			var laneTag = document.createElement(lane);

			laneTag.innerHTML = "<h2>" + lane + "</h2>";

			for(var j = 0 ; j < this.Data.BanPick.Picks[i].length ; ++j)
			{
				var champ_img = matchdetail.GetChampionImgName(this.Data.BanPick.Picks[i][j].championId);
				var tip = this.Data.BanPick.Picks[i][j].championName;
				var num = this.Data.BanPick.Picks[i][j].num;

				var newTag = document.createElement("div");
				var imgTag = document.createElement("div");

				imgTag.id = "champion_image_text";
				imgTag.innerHTML = "<img id='champion_image' src='" + matchdetail.CDN_URL + "/" + matchdetail.VERSION + "/img/champion/" + champ_img + "' title='" + tip +"'><p>" + num + "</p>";
				imgTag.className = "";
	
				newTag.appendChild(imgTag);
				laneTag.appendChild(newTag);
			}
			pickTag.appendChild(laneTag);
			pickTag.innerHTML = pickTag.innerHTML + "<br clear='both'/>";
		}
	}

	FilterBanPick()
	{
		console.log("FilterBanPick");
	}
}

////////////////////////////////////////////////////////////////////////////////////

$(function() {
	//クリックしたときのファンクションをまとめて指定
	$('.tab li').click(function() {

		//.index()を使いクリックされたタブが何番目かを調べ、
		//indexという変数に代入します。
		var index = $('.tab li').index(this);

		//コンテンツを一度すべて非表示にし、
		$('.content > li').css('display','none');

		//クリックされたタブと同じ順番のコンテンツを表示します。
		$('.content > li').eq(index).css('display','block');

		//一度タブについているクラスselectを消し、
		$('.tab li').removeClass('select');

		//クリックされたタブのみにクラスselectをつけます。
		$(this).addClass('select');
	});
});

////////////////////////////////////////////////////////////////////////////////////

function UpdateBan()
{
	view.ShowBan(view.Data.BanPick.Bans);
}

////////////////////////////////////////////////////////////////////////////////////

var view = new View();

