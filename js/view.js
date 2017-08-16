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

		this.ShowBan();
	}

	InitBanPick()
	{
		this.InitBan();
	}

	InitBan()
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
							this.Data.BanPick.Bans[l].num++;

							var isTeam = false;
							for(var m = 0 ; m < this.Data.BanPick.Bans[l].teams.length ; ++m)
							{
								if(this.Data.BanPick.Bans[l].teams[m] == matchdetail.MATCHLIST[i].teams[j].teamTag)
								{
									isTeam = true;
									break;
								}
							}

							if(!isTeam)
							{
								this.Data.BanPick.Bans[l].teams.push(matchdetail.MATCHLIST[i].teams[j].teamTag);
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
						this.Data.BanPick.Bans[index].teams = new Array;
						this.Data.BanPick.Bans[index].teams.push(matchdetail.MATCHLIST[i].teams[j].teamTag);
						this.Data.BanPick.Bans[index].num = 1;
					}
				}
			}
		}

		// ソート
		this.Data.BanPick.Bans.sort(function(a, b)
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

	////////////////////////////////////////////////////////////////////////////////////
	// Show
	////////////////////////////////////////////////////////////////////////////////////

	ShowBan()
	{
		var tags = new Array();
		var banTag = $('Ban list')[0];
		
		for(var i = 0 ; i < this.Data.BanPick.Bans.length ; ++i)
		{
			var champ_img = matchdetail.GetChampionImgName(this.Data.BanPick.Bans[i].championId);
			var tip = this.Data.BanPick.Bans[i].championName;
			var num = this.Data.BanPick.Bans[i].num;
	
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

	$('#links').children('li').addClass('all').filter('li:odd').addClass('odd');

	$('.check_box').click(function() {
		console.log("click");

		var $this = $(this),
			type = $this.attr('id');

//		$('#links').children('li').removeClass('odd').hide().filter('.' + type).show().filter(':odd').addClass('odd');
//		$('#links').children('li').removeClass('odd').hide().has('.' + type).show().filter(':odd').addClass('odd');
//		$('#links2').children('div').removeClass('odd').hide().filter('.php , .css').show().filter(':odd').addClass('odd');
		$('#links2').children('div').removeClass('odd').hide().filter('.' + type).show().filter(':odd').addClass('odd');
		return false;
	});
});


////////////////////////////////////////////////////////////////////////////////////

var view = new View();