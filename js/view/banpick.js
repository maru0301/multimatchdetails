////////////////////////////////////////////////////////////////////////////////////
// BanPick Class
////////////////////////////////////////////////////////////////////////////////////

class BanPick {

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
		this.InitBanPick();
	}

	InitBanPick()
	{
		this.InitPick();
		this.InitBanData();

		this.InitPickFilter();
		this.InitBanFilter();

		this.ShowPick(this.Data.BanPick.Picks);
		this.ShowBan(this.Data.BanPick.Bans);
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
			for(var j = 0 ; j < matchdetail.MATCHLIST[i].teams.length ; ++j)
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

								var teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
								var isNum = false;
								// Num
								for(var m = 0 ; m < this.Data.BanPick.Picks[k][l].Nums.length ; ++m)
								{
									if(this.Data.BanPick.Picks[k][l].Nums[m].teamTag == teamTag)
									{
										isNum = true;
	
										if(matchdetail.MATCHLIST[i].teams[j].teamId == 100)
											this.Data.BanPick.Picks[k][l].Nums[m].blue++;
										else
											this.Data.BanPick.Picks[k][l].Nums[m].red++;

										if(matchdetail.MATCHLIST[i].teams[j].win)
											this.Data.BanPick.Picks[k][l].Nums[m].win++;

										break;
									}
								}
	
								if(!isNum)
								{
									var num_index = this.Data.BanPick.Picks[k][l].Nums.length;
	
									this.Data.BanPick.Picks[k][l].Nums[num_index] = {};
									this.Data.BanPick.Picks[k][l].Nums[num_index].teamTag = teamTag;
									this.Data.BanPick.Picks[k][l].Nums[num_index].blue = 0;
									this.Data.BanPick.Picks[k][l].Nums[num_index].red = 0;
									this.Data.BanPick.Picks[k][l].Nums[num_index].win = 0;
									
									if(matchdetail.MATCHLIST[i].teams[j].teamId == 100)
										this.Data.BanPick.Picks[k][l].Nums[num_index].blue++;
									else
										this.Data.BanPick.Picks[k][l].Nums[num_index].red++;

									if(matchdetail.MATCHLIST[i].teams[j].win)
										this.Data.BanPick.Picks[k][l].Nums[num_index].win++;
								}
	
								// Key
								var isKey = false;
								for(var m = 0 ; m < this.Data.BanPick.Picks[k][l].keys.length ; ++m)
								{
									if(this.Data.BanPick.Picks[k][l].keys[m] == teamTag)
									{
										isKey = true;
										break;
									}
								}
	
								if(!isKey)
								{
									this.Data.BanPick.Picks[k][l].keys.push(teamTag);
								}

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
						this.Data.BanPick.Picks[k][index].keys = new Array();
						this.Data.BanPick.Picks[k][index].keys.push(matchdetail.MATCHLIST[i].teams[j].teamTag);
						
						this.Data.BanPick.Picks[k][index].Nums = new Array();
						var num_index = this.Data.BanPick.Picks[k][index].Nums.length;
						this.Data.BanPick.Picks[k][index].Nums[num_index] = {};
						this.Data.BanPick.Picks[k][index].Nums[num_index].teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
						this.Data.BanPick.Picks[k][index].Nums[num_index].blue = 0;
						this.Data.BanPick.Picks[k][index].Nums[num_index].red = 0;
						this.Data.BanPick.Picks[k][index].Nums[num_index].win = 0;
						
						if(matchdetail.MATCHLIST[i].teams[j].teamId == 100)
							this.Data.BanPick.Picks[k][index].Nums[num_index].blue++;
						else
							this.Data.BanPick.Picks[k][index].Nums[num_index].red++;

						if(matchdetail.MATCHLIST[i].teams[j].win)
							this.Data.BanPick.Picks[k][index].Nums[num_index].win++;
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

	InitPickFilter()
	{
		var keys = new Array();

		for(var i = 0 ; i < this.Data.BanPick.Picks.length ; ++i)
		{
			for(var j = 0 ; j < this.Data.BanPick.Picks[i].length ; ++j)
			{
				for(var k = 0 ; k < this.Data.BanPick.Picks[i][j].keys.length ; ++k)
				{
					if($.inArray(this.Data.BanPick.Picks[i][j].keys[k], keys) === -1)
					{
						keys.push(this.Data.BanPick.Picks[i][j].keys[k]);
					}
				}
			}
		}

		var filterTag = $('Pick filter div')[0];
		var id_name = "";
		var text = "";

		for(var i = 0 ; i < keys.length ; ++i)
		{
			id_name = "pick_filter_" + keys[i].toLowerCase();
			text = keys[i];

			var inputTag = document.createElement("input");
			inputTag.type = "checkbox";
			inputTag.className = "filter_check_box";
			inputTag.id = id_name;
			inputTag.value = keys[i];
			inputTag.name = "PickFilter";
			inputTag.onchange = UpdatePick;
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
		var newTag = document.createElement("div");

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

var banpick = new BanPick();

