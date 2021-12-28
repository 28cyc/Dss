//縣市代碼list
function ListCounty() {
	$.ajax({
		type: "GET",
		url: "https://api.nlsc.gov.tw/other/ListCounty",
		dataType: "xml",
		async: false,
		success: function (xml) {
			$(xml).find('countyItem').each(function () {
				var countycode = $(this).find("countycode").text();
				var countyname = $(this).find("countyname").text();
				ListCountyResult.push({ "countycode": countycode, "countyname": countyname });
			});
		},
		error: function (thrownError) {
			console.log(thrownError);
		}
	});
}

//鄉鎮市區list
function ListTown(countycode) {
	var ListTownArray = [];
	$.ajax({
		type: "GET",
		url: `https://api.nlsc.gov.tw/other/ListTown1/${countycode}`,
		dataType: "xml",
		async: false,
		success: function (xml) {
			$(xml).find('townItem').each(function () {
				var towncode = $(this).find("towncode").text();
				var towncode01 = $(this).find("towncode01").text();
				var townname = $(this).find("townname").text();
				ListTownArray.push({ "towncode": towncode, "towncode01": towncode01, "townname": townname });
			});
		},
		error: function (thrownError) {
			console.log(thrownError);
		}
	});
	return ListTownArray;
}

//村里list
function ListVillage(countycode, towncode01) {
	var ListVillageArray = [];
	$.ajax({
		type: "GET",
		url: `https://api.nlsc.gov.tw/other/ListVillage/${countycode}/${towncode01}`,
		dataType: "xml",
		async: false,
		success: function (xml) {
			$(xml).find('village').each(function () {
				var villageId = $(this).find("villageId").text();
				var villageName = $(this).find("villageName").text();
				ListVillageArray.push({ "villageId": villageId, "villageName": villageName });
			});
		},
		error: function (thrownError) {
			console.log(thrownError);
		}
	});
	return ListVillageArray;
}

//找村里結果
function findVillage(results) {
	var countArray = [];
	results.forEach(element => countArray.push(element.address_components.length));
	var usefulData = results.find(item => item.address_components.length == Math.max(...countArray)); //最有用的資料
	var level1 = usefulData.address_components.find(item => item.types[0] == 'administrative_area_level_1'); //直轄市
	var level2 = usefulData.address_components.find(item => item.types[0] == 'administrative_area_level_2'); //非直轄縣市
	var level3 = usefulData.address_components.find(item => item.types[0] == 'administrative_area_level_3').long_name; //鄉鎮市區
	var level4 = usefulData.address_components.find(item => item.types[0] == 'administrative_area_level_4').long_name; //村里
	var countyname = "";
	level1 && (countyname = level1.long_name);
	level2 && (countyname = level2.long_name);

	var countycode = ListCountyResult.find(item => item.countyname == countyname).countycode; //縣市代碼(H)
	var towncode01 = ListTown(countycode).find(item => item.townname == level3).towncode01; //鄉鎮市區代碼(H01)
	var villageId = ListVillage(countycode, towncode01).find(item => item.villageName == level4).villageId; //村里代碼(68000010001)
	return { "villageId": villageId, "villageName": level4 };
}