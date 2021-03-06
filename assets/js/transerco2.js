var TSC = null;
var cnew = document.getElementById('center-maps-address-aroud');
var g_placeChanged = false;
//(function (i, s, o, g, r, a, m) {
//    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
//        (i[r].q = i[r].q || []).push(arguments)
//    }, i[r].l = 1 * new Date(); a = s.createElement(o),
//    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g;
//    m.parentNode.insertBefore(a, m);
//})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//ga('create', 'UA-49879542-1', 'timbus.vn');
//ga('send', 'pageview');
//*class
function TransercoUI() {
    this.fr = 0;
    this.url = window.location.protocol + '//' + window.location.host + '/';

    //Mã tuyến cuối tuần
    this.fleetCodeWeekend = null;
};

TransercoUI.prototype.eventMouseUp = function () {//evt
    if (TSC.isClkCtr)
        TSC.isClkCtr = false;
    else
        TSC.UI.menuOptionShowHide(false);
};

TransercoUI.prototype.switchMenuOpt = function (tp) {
    this.UI.switchMenuOpt(tp);
};

TransercoUI.prototype.searchFullBlur = function (obj) {
    if (obj.value.length > 0)
        obj.className = 'input-Search input-search-none';
    else
        obj.className = 'input-Search';
};

TransercoUI.prototype.changeSearchType = function (obj) {
    if (obj.value === 3 || obj.value === 4)
        this.getEl('banner-search-key').value = 'Tất cả';
    else
        this.getEl('banner-search-key').value = '';
    this.getEl('banner-search-key').focus();
};

TransercoUI.prototype.searchFullKey = function (evt) {
    if (evt.keyCode === 13 && (this.value + '').length > 5) {
        TSC.searchFull();
    }
};

//*sign 6 hàm dùng cho autocomplete điểm dừng của điểm đi và điểm đến!
TransercoUI.prototype.searchFullKeyFindPointFr = function (evt) {
    if ((evt.keyCode === 13 || evt.keyCode === 9) && $('#lft-rt-opt-fr-auto').val().length > 5) {
        TSC.searchFullFindPointFr();
    }
}

//*sign 6 hàm dùng cho autocomplete điểm dừng của điểm đi và điểm đến!
TransercoUI.prototype.searchFullKeyFindPointFrLostFocus = function () {
    if ($('#lft-rt-opt-fr-auto').val().length > 5) {
        TSC.searchFullFindPointFr();
    }
}

TransercoUI.prototype.searchFullFindPointFr = function () {
    //$('#lft-rt-opt-clr').trigger('click');
    var key = this.getEl('lft-rt-opt-fr-auto');
    if (key.value.replace(/^\s+|\s+$/g, '').length === 0) {
        key.select();
        key.focus();
        return false;
    }
    TSC.searchFullRequestFindPointFr(key.value.replace(/^\s+|\s+$/g, ''));
    return false;
}
function isFloat(n) {
    var result = (Number(n) == n && n % 1 !== 0);
    return result;
}
//Gọi ajax để hiển thị điểm và lấy được lat lng!
TransercoUI.prototype.searchFullRequestFindPointFr = function (key) {
    var typ = "2";
    var arrCheck = key.split(',');
    var type = true; //A
    var lat;
    var lng;
    if (arrCheck != null && arrCheck.length == 2 && isFloat(arrCheck[0])) {
        lat = arrCheck[0];
        lng = arrCheck[1];
        var geo = new window.google.maps.LatLng(lat, lng);
        TSC.Mp.Map.setCenter(geo);
        TSC.Mp.addRoutePoint(true, type, geo);
    } else {
        $.ajax({
            url: "Engine/Business/Search/action.ashx",
            type: "post",
            dataType: "json",
            data: {
                act: 'searchfull',
                typ: typ,
                key: key
            },
            success: function (res) {
                if (res.st) {
                    var geo = new window.google.maps.LatLng(res.dt.Data[0].Geo.Lat, res.dt.Data[0].Geo.Lng);
                    TSC.Mp.Map.setCenter(geo);
                    TSC.Mp.addRoutePoint(true, type, geo);

                } else
                    TSC.Sr.searchFullRender([]);
            },
            error: function () {

            }
        });
    }
}

//*sign Điểm đến
TransercoUI.prototype.searchFullKeyFindPointTo = function (evt) {
    if ((evt.keyCode === 13 || evt.keyCode === 9) && $('#lft-rt-opt-to-auto').val().length > 5) {
        TSC.searchFullFindPointTo();
    }
}
//*sign 6 hàm dùng cho autocomplete điểm dừng của điểm đi và điểm đến!
TransercoUI.prototype.searchFullKeyFindPointToLostFocus = function () {
    if ($('#lft-rt-opt-to-auto').val().length > 5) {
        TSC.searchFullFindPointTo();
    }
}
TransercoUI.prototype.searchFullFindPointTo = function () {
    //$('#lft-rt-opt-clr').trigger('click');
    var key = this.getEl('lft-rt-opt-to-auto');
    if (key.value.replace(/^\s+|\s+$/g, '').length === 0) {
        key.select();
        key.focus();
        return false;
    }
    TSC.searchFullRequestFindPointTo(key.value.replace(/^\s+|\s+$/g, ''));
    return false;
}

//Gọi ajax để hiển thị!
TransercoUI.prototype.searchFullRequestFindPointTo = function (key) {
    var typ = "2";
    var type = false;//B
    var arrCheck = key.split(',');
    var lat, lng;
    if (arrCheck != null && arrCheck.length == 2 && isFloat(arrCheck[0])) {
        lat = arrCheck[0];
        lng = arrCheck[1];
        var geo = new window.google.maps.LatLng(lat, lng);
        TSC.Mp.Map.setCenter(geo);
        TSC.Mp.addRoutePoint(true, type, geo);
    } else {
        $.ajax({
            url: "Engine/Business/Search/action.ashx",
            type: "post",
            dataType: "json",
            data: {
                act: 'searchfull',
                typ: typ,
                key: key
            },
            success: function (res) {
                if (res.st) {
                    var geo = new window.google.maps.LatLng(res.dt.Data[0].Geo.Lat, res.dt.Data[0].Geo.Lng);
                    TSC.Mp.Map.setCenter(geo);
                    TSC.Mp.addRoutePoint(true, type, geo);
                } else
                    TSC.Sr.searchFullRender([]);
            },
            error: function () {

            }
        });
    }
}

TransercoUI.prototype.compareDistance = function (a, b) {
    if (a.Distance < b.Distance)
        return -1;
    else if (a.Distance > b.Distance)
        return 1;
    else
        return 0;
};

TransercoUI.prototype.mousedownMenuOpt = function () {
    this.isClkCtr = true;
};

TransercoUI.prototype.clickMenuOpt = function () {
    this.UI.menuOptionShowHide(true);
};

TransercoUI.prototype.routeByClick = function () {
    $('.search-fleet-detail-close').trigger('click');
    /*
	var ok = true;
	if(this.UI.items.left.route.params.fr.value != this.UI.items.left.route.params.fr._last){
		ok = false;
		this.UI.routeOptionAddress2Geo(this.UI.items.left.route.params.fr.kind, this.UI.items.left.route.params.fr.value, false);
	}
	if(this.UI.items.left.route.params.to.value != this.UI.items.left.route.params.to._last){
		ok = false;
		this.UI.routeOptionAddress2Geo(this.UI.items.left.route.params.to.kind, this.UI.items.left.route.params.to.value, false);
	}
	if(ok == true)*/
    this.Mp.startRouteBuyt();
};

TransercoUI.prototype.searchFull = function () {
    $('#lft-rt-opt-clr').trigger('click');
    var key = this.getEl('banner-search-key');
    //Chỗ này là kiểm tra xem có nhập gì không
    // Bỏ ngày 11/06/2018 bởi SonKT
    //if (key.value.replace(/^\s+|\s+$/g, '').length === 0) {
    //    key.select();
    //    key.focus();
    //    return false;
    //}
    this.Sr.searchFullRequest(this.getEl('banner-search-type').value, key.value.replace(/^\s+|\s+$/g, ''));
    return false;
};

TransercoUI.prototype.searchAround = function () {
    var dis = this.getEl('center-maps-search-aroud-dis');
    if (dis.value.replace(/^\s+|\s+$/g, '').length === 0) {
        dis.select();
        dis.focus();
        return;
    }

    if (dis.value == 0) {
        alert("Bán kính phải nhập > 0!");
        return;
    }

    if (dis.value > 50000) {
        alert("Bán kính tối đa không được quá 50000 m!");
        return;
    }

    this.Sr.searchAroundRequest(this.Mp.sr.mk.getPosition(), this.getEl('center-maps-search-aroud-type').value, dis.value.replace(/^\s+|\s+$/g, ''));
};

TransercoUI.prototype.initParams = function () {
    this.size = this.getWindowSize();
};

TransercoUI.prototype.renderInfoWindowContent = function (tp, tx, dt) {
    if (tp === 2 || tp === 3 || tp === 4 || tp === 5) {
        var bd = this.crtEl('div', '');
        var ct = this.crtEl('div', 'sr-info-win-content');
        ct.innerHTML = tx;

        bd.appendChild(ct);
        bd.appendChild(this.createBottonPanel(tp, dt));

        return bd;
    } else {
        return tx;
    }
};

TransercoUI.prototype.createBottonPanel = function (tp, dt) {
    try {
        var tbl = this.crtEl('table', 'sr-info-win-bottom-panel');
        var tbd = this.crtEl('tbody', '');
        var trm = this.crtEl('tr', '');
        var tdf = this.crtEl('td', 'sr-info-win-bottom-left');
        var tdv = this.crtEl('td', 'sr-info-win-bottom-center');
        var tdt = this.crtEl('td', 'sr-info-win-bottom-right');

        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;

        var afr = this.crtEl('a', '');
        var avh = this.crtEl('a', '');
        var ato = this.crtEl('a', '');

        afr.innerHTML = 'Điểm xuất phát';
        avh.innerHTML = 'Xe sắp tới điểm dừng';
        ato.innerHTML = 'Điểm kết thúc';

        afr.href = 'javascript:void(0);';
        avh.href = 'javascript:void(0);';
        ato.href = 'javascript:void(0);';

        afr._tp = true;
        avh._tp = 1;
        ato._tp = false;

        afr._dt = dt;
        avh._dt = dt;
        ato._dt = dt;

        afr.onclick = this.clickButtomPanelItem;
        avh.onclick = this.clickButtomPanelItem;
        ato.onclick = this.clickButtomPanelItem;

        tdf.appendChild(afr);
        tdv.appendChild(avh);
        tdt.appendChild(ato);

        trm.appendChild(tdf);
        if (tp === 2)
            trm.appendChild(tdv);
        trm.appendChild(tdt);

        tbd.appendChild(trm);
        tbl.appendChild(tbd);

        return tbl;
    } catch (ex) {
        alert(ex);
        return '';
    }
};

TransercoUI.prototype.clickButtomPanelItem = function () {
    if (this._tp === true || this._tp === false) {
        TSC.switchMenuOpt(1);
        TSC.Mp.addRoutePoint(true, this._tp, new window.google.maps.LatLng(this._dt.Geo.Lat, this._dt.Geo.Lng), this._dt);
        if (TSC.Mp.rt.fr && TSC.Mp.rt.to)
            TSC.Rt.startRouteBuyt(TSC.Mp.rt.fr.getPosition(), TSC.Mp.rt.to.getPosition());
    } else {
        TSC.Sr.vehicleOverStationRequest(this._dt);
    }

    TSC.Mp.rt.wi.close();
};

TransercoUI.prototype.renderDateTime = function (dt) {
    var y = dt.getFullYear();
    var m = dt.getMonth() + 1;
    var d = dt.getDate();
    var h = dt.getHours();
    var mm = dt.getMinutes();
    var s = dt.getSeconds();
    if (m < 10)
        m = '0' + m;
    if (d < 10)
        d = '0' + d;
    if (h < 10)
        h = '0' + h;
    if (mm < 10)
        mm = '0' + mm;
    if (s < 10)
        s = '0' + s;
    return y + '/' + m + '/' + d + ' ' + h + ':' + mm + ':' + s;
};

var zm = '';		// Key mã hóa

TransercoUI.prototype.roundDistance = function (dis) {
    if (dis < 1000)
        return dis + ' m';
    else {
        dis = parseFloat(dis);
        return (parseFloat(dis / 1000)).toFixed(1) + ' km';
    }
};

TransercoUI.prototype.roundDistanceIsWeekend = function (dis, iwk) {
    var str;
    if (dis < 1000)
        str = dis + ' m';
    else {
        dis = parseFloat(dis);
        str = (parseFloat(dis / 1000)).toFixed(1) + ' km';
    }
    if (iwk) {
        str += '<br/><b><i style="font-size:0.8em;color:red;">T7 - CN</i></b>';
    }
    return str;
};

TransercoUI.prototype.roundTime = function (tms) {
    //if (tms < 30)
    //    return '00:00:30';
    var sec_num = parseInt(tms, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
};

TransercoUI.prototype.crtEl = function () {
    var o = document.createElement('div');
    return o;
};

TransercoUI.prototype.crtEl = function (tg, cl) {
    var o = document.createElement(tg);
    o.className = cl;
    return o;
};

TransercoUI.prototype.getEl = function (id) {
    try {
        var o = document.getElementById(id);
        return o;
    } catch (ex) {
        return null;
    }
};

TransercoUI.prototype.onGetCurrentLocation = function (type) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            //Ham thuc hien khi dinh vi thanh cong
            function (position) {
                var geo = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                if (Math.abs(geo.lat() - 21.0333) < 0.00005 && Math.abs(geo.lng() - 105.8500) < 0.00005
                ) //Kiểm tra Số 2, Lương Văn Can (21.033333000000002, 105.85000000000002)
                    TSC.Mp.Map.setZoom(13);
                else
                    TSC.Mp.addRoutePoint(true, type, geo);
                if (type)
                    TSC.UI.items.lft.opt.ctr.lf.src = TSC.url + 'images/route/current_location.png';
                else
                    TSC.UI.items.lft.opt.ctr.lt.src = TSC.url + 'images/route/current_location.png';
            }
            //Neu khong cho phep dinh vi , lay theo map center
            ,
            function () {
                var pos = TSC.Mp.Map.getCenter();
                if (Math.abs(pos.lat() - 21.0333) < 0.00005 && Math.abs(pos.lng() - 105.8500) < 0.00005
                ) //Kiểm tra Số 2, Lương Văn Can (21.033333000000002, 105.85000000000002)
                    TSC.Mp.Map.setZoom(13);
                else
                    TSC.Mp.addRoutePoint(true, type, pos);

                if (type)
                    TSC.UI.items.lft.opt.ctr.lf.src = TSC.url + 'images/route/current_location.png';
                else
                    TSC.UI.items.lft.opt.ctr.lt.src = TSC.url + 'images/route/current_location.png';
            }
        );
    } else {
        alert("Chức năng lấy vị trí không được khởi tạo");
    }
};

var zn = '';		// Mã chuẩn	--ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=

TransercoUI.prototype.getWindowSize = function () {
    try {
        var ww = 0, hh = 0;
        if (window.innerWidth)
            ww = window.innerWidth;
        else if (this.isIE)
            ww = document.body.parentElement.clientWidth;
        else if (document.body && document.body.clientWidth)
            ww = document.body.clientWidth;

        if (window.innerHeight)
            hh = window.innerHeight;
        else if (this.isIE)
            hh = document.body.parentElement.clientHeight;
        else if (document.body && document.body.clientHeight)
            hh = document.body.clientHeight;

        return { w: ww, h: hh };
    } catch (ex) {
        return { w: 1000, h: 500 };
    }
};

TransercoUI.prototype.getObjectSize = function (elem) {
    var ww = 0, hh = 0;
    if (elem.offsetWidth)
        ww = elem.offsetWidth;
    else if (elem.clip && elem.clip.width)
        ww = elem.clip.width;
    else if (elem.style && elem.style.pixelWidth)
        ww = elem.style.pixelWidth;

    if (elem.offsetHeight)
        hh = elem.offsetHeight;
    else if (elem.clip && elem.clip.height)
        hh = elem.clip.height;
    else if (elem.style && elem.style.pixelHeight)
        hh = elem.style.pixelHeight;

    return { w: parseInt(ww), h: parseInt(hh) };
};

TransercoUI.prototype.hasClass = function (ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

TransercoUI.prototype.addClass = function (ele, cls) {
    if (!this.hasClass(ele, cls))
        ele.className += " " + cls;
};

TransercoUI.prototype.removeClass = function (ele, cls) {
    if (this.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
};
//*sign
function onLoad() {
    console.log('Go to onLoad!');
    TSC = new TransercoUI();

    TSC.initParams();
    TSC.UI = new MainUI();
    TSC.Rt = new RouteUI();
    TSC.Sr = new SearchUI();
    TSC.Pr = new PrintfUI();
    TSC.Bs = { ky: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = TSC.Bs._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this.ky.charAt(s) + this.ky.charAt(o) + this.ky.charAt(u) + this.ky.charAt(a) } return t }, ibc: function () { var a = [122, 110, 61, 116, 104, 105, 115, 46, 107, 121, 59], b = [122, 109, 61, 116, 104, 105, 115, 46, 107, 105, 59]; var s = ''; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); eval(s); }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this.ky.indexOf(e.charAt(f++)); o = this.ky.indexOf(e.charAt(f++)); u = this.ky.indexOf(e.charAt(f++)); a = this.ky.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a !== 64) { t = t + String.fromCharCode(i) } } t = TSC.Bs._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, ki: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=", _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
    //*sign
    TSC.Mn = new BAMenu({
        focusColor: '#00356A',
        textColor: '#FFFFFF',
        hideMouseOut: true,
        scope: TSC.Mp,
        items: [{
            text: 'Chọn điểm xuất phát',
            iconCls: 'ui-maps-route-from',
            scope: this,
            handler: function () {
                this.addRoutePoint(true, true, this.Map.geo);
            }
        }, {
            text: 'Chọn điểm đến',
            iconCls: 'ui-maps-route-to',
            scope: this,
            handler: function () {
                this.addRoutePoint(true, false, this.Map.geo);
            }
        }
            , '-',
        {
            text: 'Tìm kiếm xung quanh',
            iconCls: 'ui-maps-search-around',
            scope: this,
            handler: function () {
                this.searchAround(this.Map.geo);
            }
        }
            , '-',
        {
            text: 'Phóng to',
            iconCls: 'ui-maps-zoom-in',
            scope: this,
            handler: function () {
                this.Map.setZoom(this.Map.getZoom() + 1);
            }
        }, {
            text: 'Thu nhỏ',
            iconCls: 'ui-maps-zoom-out',
            scope: this,
            handler: function () {
                this.Map.setZoom(this.Map.getZoom() - 1);
            }
        }, '-', {
            text: 'Di chuyển vào giữa',
            iconCls: 'ui-maps-move-center',
            scope: this,
            handler: function () {
                this.Map.panTo(this.Map.geo);
            }
        }, '-', {
            text: 'Xem địa chỉ',
            iconCls: 'ui-maps-move-center',
            scope: this,
            handler: function () {
                var add;
                var that = this;
                var latlng = this.Map.geo;
                $.ajax({
                    url: "Engine/Business/Route/action.ashx",
                    type: "post",
                    dataType: "json",
                    data: {
                        act: 'geo2add',
                        lng: latlng.lng(),
                        lat: latlng.lat()
                    },
                    success: function (dts) {
                        if (dts.success) {
                            add = dts.dt.Address;
                            console.log(add);
                            that.searchAddress(latlng, add);//*sign
                        }
                    },
                    error: function () {
                        //alert( "AJAX - error()" );
                    }
                });
                //var geocoder = new google.maps.Geocoder();
                //geocoder.geocode({ 'latLng': latlng }, function (data, status) {
                //    if (status == google.maps.GeocoderStatus.OK) {
                //        var add = data[1].formatted_address; //this is the full address
                //        console.log(add);
                //        that.searchAddress(latlng, add);//*sign
                //    }
                //});
            }
        }

        ]
    });
    TSC.Bs.ibc();

    if (typeof (document.attachEvent) != 'undefined') {
        document.attachEvent('onmouseup', TSC.eventMouseUp);
    } else if (typeof (document.addEventListener) != 'undefined') {
        document.addEventListener('mouseup', TSC.eventMouseUp, false);
    };
    TSC.fleetCodeWeekend = $('.hdfInfoRouteWeekendCss').text().split(',');
};

//*class MainUI: Quản lý các khung panel trong hệ thống trang chủ timbus!
function MainUI() {
    this.tab = 1;
    this.size = {
        top: { h: 81 },
        lpn: {
            w: 360,
            pad: { l: 5 },
            hdr: { h: 71 },
            ftr: { h: 41 },
            opt: { h: 139 }
        },
        pad: {},
        cen: {}
    };

    this.views = {
        left: 350,
        top: 83,
        bottom: 2,
        padding: { left: 2, top: 2, bottom: 2 },
        tab: 1
    };

    this.items = {
        mnp: {},
        lft: {
            hdr: {},
            opt: {
                ctr: {},
                dts: {}
            },
            fin: {},
            app: {},
            adv: {},
            ftr: {}
        },
        msd: {
            lft: {}
        },
        map: {
        }
    };

    // Mảng ảnh quảng cáo sử dụng trong trang chủ TimBus!
    this.adv = [
        {
            resid: '0',
            im: 'images/adv/timbus-banner.jpg',
            nm: '',
            hf: 'http://timbus.vn'
        }, {
            resid: '0',
            im: 'images/adv/register_ticket_online.jpg',
            nm: 'Từ ngày 10/08/2016 Transerco triển khai dịch vụ làm thẻ vé tháng trực tuyến.',
            hf: '/TicketRegister/register.aspx'
        }, {
            resid: '0',
            im: 'images/adv/banner-86.jpg',
            nm: '',
            hf: 'https://www.facebook.com/BusExpress86/'
        }, {
            resid: '0',
            im: 'images/adv/neway-small.jpg',
            nm: '',
            hf: 'http://newwayjsc.com.vn'
        }
    //{
    //    im: 'register_ticket_online.jpg',
    //    nm: 'Từ ngày 10/08/2016 Transerco triển khai dịch vụ làm thẻ vé tháng trực tuyến.',
    //    hf: '/TicketRegister/register.aspx'
    //}, {
    //    im: 'diem-ban-ve.jpg',
    //    nm: 'Danh sách các điểm bán vé xe buýt',
    //    hf: 'http://transerco.com.vn/'
    //}
    /*{
		im: 'oto-hoan-kiem.jpg',
		nm: 'Xí nghiệp Toyota Hoàn Kiếm được thành lập ngày 10/5/1997',
		ad: 'Trụ sở chính: Số 5 Lê Thánh Tông, Hoàn Kiếm, Hà Nội',
		mb: 'Điện thoại: (043)8.250914, Fax: (043)8.256889'
	}, {
		im: 'xe-khach-nam.jpg',
		nm: 'Xí nghiệp xe khách Nam Hà Nội',
		ad: 'Trụ sở chính: 90 Nguyễn Tuân, Thanh Xuân, Hà Nội',
		mb: 'Điện thoại: (043)8584362, Fax: (043)8585150'
	}, {
		im: 'van-tai-ha-noi.jpg',
		nm: 'Xí nghiệp Vận tải du lịch Hà Nội (NEWWAY)',
		ad: 'Địa chỉ: 122 Xuân Thủy, Q.Cầu Giấy, Hà Nội',
		mb: 'Điện thoại: 043.565 4898, Fax: 043.754 9547'
	}, {
		im: 'trung-dai-tu-oto.jpg',
		nm: 'Trung đại tu ô tô',
		ad: 'Địa chỉ: Số 124, đường Xuân Thủy, Quận Cầu Giấy, Thành phố Hà Nội',
		mb: 'Điện thoại: 043.7549219, Fax: 043.7549218'
	}, {
		im: 'xe-dien-ha-noi.jpg',
		nm: 'Xí nghiệp xe điện Hà Nội',
		ad: 'Địa chỉ: 69 Thuỵ Khuê, Tây Hồ, Hà Nội',
		mb: 'Điện thoại: 043 8473922, Fax: (043) 8473812'
	}, {
		im: '10-10.jpg',
		nm: 'Xí nghiệp xe Buýt 10.10 Hà Nội',
		ad: 'Địa chỉ: 90 Nguyễn Tuân, quận Thanh Xuân, Thành phố Hà Nội',
		mb: 'Điện thoại: 043.5584673, Fax: 043.5586535'
	}, {
		im: 'bus-ha-noi.jpg',
		nm: 'Xí nghiệp xe buýt Hà Nội',
		ad: 'Địa chỉ: 29 Lạc Trung, quận Hai Bà Trưng, Hà Nội',
		mb: 'Điện thoại: 043.9714590, Fax: 043.8212305'
	}, {
		im: 'thang-long.jpg',
		nm: 'Xí nghiệp xe buýt Thăng Long',
		ad: 'Địa chỉ: Điểm đỗ xe Kim Ngưu II - P.Hoàng Văn Thụ - Q.Hoàng Mai - Hà Nội',
		mb: 'Điện thoại: (043)6342634, Fax:(043)6342656'
	}, {
		im: 'lien-ninh.jpg',
		nm: 'Xí nghiệp xe buýt Liên Ninh',
		ad: 'Địa chỉ: Thôn Yên Phú, xã Liên Ninh, huyện Thanh Trì, thành phố Hà Nội',
		mb: 'Điện thoại: 04.36866507, Fax: 04.36866507'
	}, {
		im: 'tan-dat.jpg',
		nm: 'Trung tâm Tân Đạt',
		ad: 'Địa chỉ: 124 Xuân Thủy – Cầu Giấy – Hà Nội',
		mb: 'Điện thoại: 043.8567567 – 043.7549289, Fax:043.7549291'
	}, {
		im: 'ben-xe-ha-noi.jpg',
		nm: 'Công ty TNHH MTV Bến xe Hà Nội',
		ad: 'Địa chỉ trụ sở chính: Bến xe phía Nam (Tầng 2), Giải Phóng, Hoàng Mai, Hà Nội',
		mb: 'Điện thoại: (043)8642439, Fax: (043)8644536'
	}, {
		im: 'xe-khach-ha-noi.jpg',
		nm: 'Công ty cổ phần xe khách Hà Nội',
		ad: 'Địa chỉ: Gác 2 Bến Xe Gia Lâm - Hà Nội',
		mb: 'Điện thoại: (043)8271923, Fax: (043)8733011'
	}, {
		im: 'xang-dau.jpg',
		nm: 'Công ty Xăng dầu chất đốt Hà Nội',
		ad: 'Địa chỉ: Số 438 Trần Khát Chân, phường Phố Huế, quận Hai Bà Trưng, TP Hà Nội',
		mb: 'Điện thoại: 043.9780731 – 043.9782833, Fax: 043.9782341'
	}, {
		im: 'van-tai-hang-hoa.jpg',
		nm: 'Công ty cổ phần Vận tải & Dịch vụ hàng hóa Hà Nội',
		ad: 'Địa chỉ: 27/785 Trương Định - Hoàng Mai - Hà Nội',
		mb: 'Điện thoại: 043.8641050 - 043.8642881, Fax: 043.8642281'
	}*/]; //*sign End Array Advert!

    this.initSize();
    this.initCenter();

    var that = this;
    $(window).resize(function () {
        that.initSize();
        that.resizeMap();
    });

    //this.initWebBrowserAlert(navigator != null && navigator.appName === 'Microsoft Internet Explorer');
};

MainUI.prototype.menuOptionShowHide = function (tp) {
    if (!this.items.mnp.sts && !tp)
        return;
    if (!this.items.mnp.arw) {
        this.items.mnp.arw = TSC.getEl('tp-mn-arw');
        this.items.mnp.bnd = TSC.getEl('tp-mn-bnd');
        if (this.items.mnp.arw == null) {
            this.items.mnp.sts = false;
            return;
        }
    }
    var st = 'none';
    if (tp && this.items.mnp.arw.style.display === 'none')
        st = '';

    this.items.mnp.arw.style.display = st;
    this.items.mnp.bnd.style.display = st;
    this.items.mnp.sts = (st !== 'none');

};

//MainUI.prototype.initWebBrowserAlert = function (st) {
//    var ws = TSC.getWindowSize();
//    var wc = TSC.getEl('wb-alert-close');
//    var wb = TSC.getEl('wb-alert-content');
//    var ww = 500, hh = 100;

//    wc.style.left = (ws.w + ww - 16) / 2 + 'px';
//    wc.style.top = (ws.h - hh - 16) / 2 + 'px';
//    wc.style.display = st ? '' : 'none';
//    wc.onclick = this.clickWebBrowserAlert;

//    wb.style.width = ww + 'px';
//    wb.style.left = (ws.w - ww) / 2 + 'px';
//    wb.style.top = (ws.h - hh) / 2 + 'px';
//    wb.style.display = st ? '' : 'none';
//};

//MainUI.prototype.clickWebBrowserAlert = function () {
//    var wc = TSC.getEl('wb-alert-close');
//    var wb = TSC.getEl('wb-alert-content');
//    if (wc)
//        wc.style.display = 'none';
//    if (wb)
//        wb.style.display = 'none';
//};

MainUI.prototype.initSize = function () {
    var ws = TSC.getWindowSize();
    this.size.cen.w = ws.w - this.size.lpn.w;
    this.size.cen.h = ws.h - this.size.top.h;
    var hd = TSC.getEl('tbl-header');
    if (hd)
        hd.style.width = ws.w + 'px';
};

MainUI.prototype.initPanelLeft = function () {
    console.log('Go to initPanelLeft');
    if (!this.items.lft.bnd)
        this.items.lft.bnd = TSC.getEl('left');
    this.items.lft.bnd.style.width = this.size.lpn.w + 'px';
    this.items.lft.bnd.style.height = this.size.cen.h + 'px';

    if (!this.items.lft.hdr.bnd) {
        this.items.lft.hdr.bnd = TSC.getEl('lft-hdr-bnd');
        this.items.lft.hdr.bnd.style.height = this.size.lpn.hdr.h + 'px';
    }

    if (!this.items.lft.hdr.tog) {
        this.items.lft.hdr.tog = TSC.getEl('lft-hdr-tog-map');
        this.items.lft.hdr.tog.style.height = (this.size.lpn.hdr.h - 15) + 'px';
        var img = this.items.lft.hdr.tog.getElementsByTagName('img');
        img[0].style.top = (this.size.lpn.hdr.h - 40) / 2 + 'px';
        this.items.lft.hdr.tog.scope = this;
        this.items.lft.hdr.tog.onclick = function () { this.scope.leftShowHide.apply(this.scope, [false]); };
    }

    if (!this.items.lft.opt.bnd) {
        this.items.lft.opt.bnd = TSC.getEl('lft-rt-opt');
        this.items.lft.opt.bnd.style.height = this.size.lpn.opt.h + 'px';

        //*sign Thêm lấy theo điểm dừng ở đây!
        var that = this;
        //Lấy địa chỉ google điểm đi *sign cho auto google!
        this.items.lft.opt.ctr.fr = TSC.getEl('lft-rt-opt-fr');
        //Lấy địa chỉ google điểm đi
        this.items.lft.opt.ctr.fr.googleMapAutoComplete = new window.google.maps.places.Autocomplete(this.items.lft.opt.ctr.fr);

        var that = this;
        that.items.lft.opt.ctr.fr.googleMapAutoComplete.bindTo('bounds', TSC.Mp.Map);
        that.items.lft.opt.ctr.fr.googleMapAutoComplete.addListener('place_changed', function () {
            var place = that.items.lft.opt.ctr.fr.googleMapAutoComplete.getPlace();
            if (!place.geometry) {
                return;
            }
            that.items.lft.opt.ctr.fr.findGoogle = true;
            that.routeOptionGoogleMap(true, place.geometry.location, true);

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                TSC.Mp.Map.fitBounds(place.geometry.viewport);
            } else {
                TSC.Mp.Map.setCenter(place.geometry.location);
            }
        });

        this.items.lft.opt.ctr.fr.kind = true;
        this.items.lft.opt.ctr.fr.scope = this;
        this.items.lft.opt.ctr.fr.onblur = this.blurRouteOption;
        //this.items.lft.opt.ctr.fr.onkeyup = this.keyupRouteOption;

        this.items.lft.opt.ctr.fr.onfocus = this.focusRouteOption;
        this.items.lft.opt.ctr.fr.style.width = (this.size.lpn.w - 156) + 'px';

        this.items.lft.opt.ctr.lf = TSC.getEl('lft-rt-opt-loc-fr');
        this.items.lft.opt.ctr.lf.type = true;
        this.items.lft.opt.ctr.lf.onclick = this.clickGetCurrentLocation;
        //Lấy địa chỉ điểm đi *sign cho auto điểm dừng
        this.items.lft.opt.ctr.fr_auto = TSC.getEl('lft-rt-opt-fr-auto');

        //Lấy địa chỉ google điểm đến *sign      
        this.items.lft.opt.ctr.to = TSC.getEl('lft-rt-opt-to');
        //Lấy địa chỉ google điểm đến
        this.items.lft.opt.ctr.to.googleMapAutoComplete = new window.google.maps.places.Autocomplete(this.items.lft.opt.ctr.to);

        that.items.lft.opt.ctr.to.googleMapAutoComplete.bindTo('bounds', TSC.Mp.Map);
        that.items.lft.opt.ctr.to.googleMapAutoComplete.addListener('place_changed', function () {
            var place = that.items.lft.opt.ctr.to.googleMapAutoComplete.getPlace();
            if (!place.geometry) {
                return;
            }
            that.items.lft.opt.ctr.to.findGoogle = true;
            that.routeOptionGoogleMap(false, place.geometry.location, true);

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                TSC.Mp.Map.fitBounds(place.geometry.viewport);
            } else {
                TSC.Mp.Map.setCenter(place.geometry.location);
            }
        });

        this.items.lft.opt.ctr.to.kind = false;
        this.items.lft.opt.ctr.to.scope = this;
        this.items.lft.opt.ctr.to.onblur = this.blurRouteOption;
        this.items.lft.opt.ctr.to.onfocus = this.focusRouteOption;
        this.items.lft.opt.ctr.to.style.width = (this.size.lpn.w - 156) + 'px';

        //Lấy theo điểm dừng
        this.items.lft.opt.ctr.to_auto = TSC.getEl('lft-rt-opt-to-auto');


        this.items.lft.opt.ctr.lt = TSC.getEl('lft-rt-opt-loc-to');
        this.items.lft.opt.ctr.lt.type = false;
        this.items.lft.opt.ctr.lt.onclick = this.clickGetCurrentLocation;

        this.items.lft.opt.ctr.rv = TSC.getEl('lft-rt-opt-rvt');
        this.items.lft.opt.ctr.rv.scope = this;
        this.items.lft.opt.ctr.rv.onclick = this.clickRevertRoute;

        this.items.lft.opt.ctr.tp = TSC.getEl('lft-rt-opt-tp');
        TSC.getEl('lft-rt-opt-tp-bn').style.width = (this.size.lpn.w - 122) + 'px';

        this.items.lft.opt.ctr.cl = TSC.getEl('lft-rt-opt-clr');
        this.items.lft.opt.ctr.cl.scope = this;
        this.items.lft.opt.ctr.cl.onclick = this.clickClearRoute;

        this.items.lft.opt.ctr.bt = TSC.getEl('lft-rt-opt-btn');
    }

    if (!this.items.lft.app.bnd) {
        //this.items.lft.app.height = 190;		// Chiều cao cần trừ đi của bảng quảng cáo (78: Khi không có ảnh điểm bán vé)
        this.items.lft.app.height = 78;
        this.items.lft.app.bnd = TSC.getEl('lft-app-bnd');
    }

    if (!this.items.lft.adv.bnd) {
        this.items.lft.adv.bnd = TSC.getEl('lft-adv-bnd');
        this.items.lft.adv.bnd.style.height = (this.size.cen.h - this.size.lpn.hdr.h - this.size.lpn.opt.h - this.size.lpn.ftr.h - 18 - this.items.lft.app.height) + 'px';

        this.items.lft.adv.ctn = TSC.getEl('lft-adv-ctn');
        this.items.lft.adv.ctn.style.height = (this.size.cen.h - this.size.lpn.hdr.h - this.size.lpn.opt.h - this.size.lpn.ftr.h - 18 - this.items.lft.app.height) + 'px';
    }

    if (!this.items.lft.ftr.cpy) {
        this.items.lft.ftr.cpy = TSC.getEl('lft-ftr-copy-right');
        this.items.lft.ftr.cpy.style.width = this.size.lpn.w + 'px';
        this.items.lft.ftr.cpy.style.height = this.size.lpn.ftr.h + 'px';
        var div = this.items.lft.ftr.cpy.getElementsByTagName('div');
        div[0].style.width = (this.size.lpn.w - 10) + 'px';
        div[0].style.height = (this.size.lpn.ftr.h - 10) + 'px';
    }

    if (!this.items.lft.fin.bnd) {
        this.items.lft.fin.bnd = TSC.getEl('lft-find-bnd');
    }
};

MainUI.prototype.initPanelMap = function () {
    //Phần hiệu ứng shadown bên trái bản đồ
    if (!this.items.msd.lft.bnd)
        this.items.msd.lft.bnd = TSC.getEl('msh-lft-bnd');
    var div = this.items.msd.lft.bnd.getElementsByTagName('div');
    for (var i = 0; i < div.length; i++) {
        if (div[i].className.indexOf('m-b-w-o') > -1)
            div[i].style.height = this.size.cen.h + 'px';
    }
    this.items.msd.lft.bnd.style.left = this.size.lpn.w + 'px';
    this.items.msd.lft.bnd.style.height = this.size.cen.h + 'px';

    this.resizeMap();

    //Nút hiện panel bên trái
    if (!this.items.map.slf) {
        this.items.map.slf = TSC.getEl('tog-show-left');
        this.items.map.slf.style.display = 'none';
        this.items.map.slf.scope = this;
        this.items.map.slf.onclick = function () { this.scope.leftShowHide.apply(this.scope, [true]); };
    }
    this.items.map.slf.style.left = this.size.lpn.w + 'px';
};

MainUI.prototype.resizeMap = function () {
    //Hiệu chỉnh kích thước vùng bản đồ
    if (!this.items.map.map)
        this.items.map.map = TSC.getEl('maps');
    this.items.map.map.style.left = this.size.lpn.w + 'px';
    this.items.map.map.style.width = this.size.cen.w + 'px';
    this.items.map.map.style.height = this.size.cen.h + 'px';
}

MainUI.prototype.leftShowHide = function (st) {
    this.items.lft.bnd.style.display = st ? '' : 'none';
    this.items.msd.lft.bnd.style.left = (st ? this.size.lpn.w : 0) + 'px';
    this.items.map.map.style.left = (st ? this.size.lpn.w : 0) + 'px';
    this.items.map.slf.style.left = (st ? this.size.lpn.w : 0) + 'px';
    this.items.map.slf.style.display = st ? 'none' : '';
    this.items.map.map.style.width = (st ? this.size.cen.w : this.size.cen.w + this.size.lpn.w) + 'px';
    window.google.maps.event.trigger(TSC.Mp.Map, "resize");
};

MainUI.prototype.initCenter = function () {
    //    this.initPanelLeft();
    this.initPanelMap();


    TSC.Mp = new MapUI(this.items.map.map, {
        left: this.size.lpn.w,
        top: this.size.top.h
    });
    this.initPanelLeft();
    this.initAdv();
};

MainUI.prototype.initAdv = function () {
    var self = this;

    self.displayAdvertHomePage();

    self.startAdv();

    self.adjustAdvSize(1);
};

//*sign Lấy ảnh quảng cáo từ DB
MainUI.prototype.displayAdvertHomePage = function () {
    var ulAllAdvert = document.createElement('ul');
    var self = this;
    //Lấy ảnh trong Slide!
    $.ajax({
        url: "Engine/Business/Route/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'advert',
            key: 'HomeSlide'
        },
        success: function (result) {
            if (result.st) {
                self.adv = [];
                self.adv = result.dt;
            }

            for (var i = 0; i < self.adv.length; i++) {
                var ui = document.createElement('li');
                var lk = document.createElement('a');
                var im = document.createElement('img');
                var nm = TSC.crtEl('div', 'adv-item-nm');
                (function (item, element) {
                    element.onclick = function () {
                        console.log(item.resid);
                        console.log(item.hf);
                        $.ajax({
                            url: "Engine/Business/Route/action.ashx",
                            type: "post",
                            dataType: "json",
                            data: {
                                act: 'statistic',
                                key: item.resid
                            }
                        });
                        window.open(item.hf);
                    };
                })(self.adv[i], lk);

                lk.style = "cursor:pointer;";
                im.src = self.adv[i].im;        //*sign
                im.style = "width:330px;";
                nm.innerHTML = self.adv[i].nm;
                lk.appendChild(im);
                ui.appendChild(lk);
                ulAllAdvert.appendChild(ui);
            }

            self.items.lft.adv.ctn.appendChild(ulAllAdvert);

            $('#lft-adv-ctn').jcarousel({
                vertical: true,
                animation: 1000,
                wrap: 'circular'
            });

            $('#lft-adv-ctn').jcarouselAutoscroll({
                interval: 5000, //5 giây trượt 1 ảnh!
                autostart: true
            });
        },
        error: function (e) {
            console.log('Lỗi lấy dữ liệu từ DB!' + e);
        }
    });

    //Lấy ảnh trong popup
    $.ajax({
        url: "Engine/Business/Route/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'advert',
            key: 'HomePopUp'
        },
        success: function (result) {
            if (result.st) {
                $('#advertPopUp').show();
                $('#popupLink').click(function () {
                    console.log(result.dt[0].resid);
                    console.log(result.dt[0].hf);
                    window.open(result.dt[0].hf); //*sign chuyển trang mới luôn rồi!
                    $.ajax({
                        url: "Engine/Business/Route/action.ashx",
                        type: "post",
                        dataType: "json",
                        data: {
                            act: 'statistic',
                            key: result.dt[0].resid
                        }
                    });
                });

                $('#popupImage').attr("src", result.dt[0].im);
                setTimeout(function () {
                    hide_float_right();
                },
                    5000);
            } else $('#advertPopUp').hide(); //else hide_float_right();
        }
    });
};

MainUI.prototype.startAdv = function () {
    //$('#lft-adv-ctn').jcarousel('reload');
};

MainUI.prototype.blurRouteOption = function (evt) {
    if (!this.findGoogle) {
        if (this._data == undefined || this._data !== this.value) {
            this._data = this.value;
            this.scope.routeOptionAddress2Geo(this.kind, this.value, true);
        }
    }

};

MainUI.prototype.focusRouteOption = function () {
    this.findGoogle = false;
};

MainUI.prototype.keyupRouteOption = function (evt) {
    if (!this.findGoogle) {
        if (evt.keyCode === 13 && (this.value + '').length > 5) {
            this.scope.routeOptionAddress2Geo(this.kind, this.value, true);
        }
    }
};

MainUI.prototype.clickGetCurrentLocation = function () {
    this.src = TSC.url + 'images/route/waiting.gif';
    TSC.onGetCurrentLocation(this.type);
};

MainUI.prototype.clickRevertRoute = function () {
    if (!this.scope.items.lft.opt.dts.fr || !this.scope.items.lft.opt.dts.to)
        return;
    var dt = this.scope.items.lft.opt.ctr.fr._data;
    var vl = this.scope.items.lft.opt.ctr.fr.value;
    this.scope.items.lft.opt.ctr.fr._data = this.scope.items.lft.opt.ctr.to._data;
    this.scope.items.lft.opt.ctr.fr.value = this.scope.items.lft.opt.ctr.to.value;
    this.scope.items.lft.opt.ctr.to._data = dt;
    this.scope.items.lft.opt.ctr.to.value = vl;

    dt = this.scope.items.lft.opt.dts.fr;
    this.scope.items.lft.opt.dts.fr = this.scope.items.lft.opt.dts.to;
    this.scope.items.lft.opt.dts.to = dt;

    var tempFr = $('#lft-rt-opt-fr-auto').val();
    var tempTo = $('#lft-rt-opt-to-auto').val();
    $('#lft-rt-opt-to-auto').val(tempFr);
    $('#lft-rt-opt-fr-auto').val(tempTo);

    TSC.Mp.revertRouteGeo();
};
//*sign xóa sạch bản đồ để thực hiện chức năng khác!
MainUI.prototype.clickClearRoute = function () {
    TSC.Mp.clearRouteBuyt();
    TSC.Rt.clearRouteBuyt();

    this.scope.items.lft.opt.dts.fr = null;
    this.scope.items.lft.opt.dts.to = null;
    $('#lft-rt-opt-fr-auto').val('');
    $('#lft-rt-opt-to-auto').val('');

    this.scope.items.lft.opt.ctr.fr._data = '';
    this.scope.items.lft.opt.ctr.fr.value = '';
    this.scope.items.lft.opt.ctr.to._data = '';
    this.scope.items.lft.opt.ctr.to.value = '';

    TSC.Rt.bound.style.display = 'none';

    //this.scope.items.lft.adv.bnd.style.display = '';
    this.scope.items.lft.app.bnd.style.display = '';
    this.scope.items.lft.adv.bnd.style.position = 'relative';
    this.scope.items.lft.adv.bnd.style.visibility = 'visible';

    this.scope.adjustAdvSize(1);

    this.style.display = 'none';
};

MainUI.prototype.fillRouteGeo = function (kd, tp, gx, dt) {
    this.switchMenuOpt(1);
    var addr = dt.Name ? dt.Name : dt.Address;
    if (tp) {
        this.items.lft.opt.dts.fr = { gx: gx, dt: dt };
        if (dt.ObjectID) {

            TSC.Mp.rt.fr._dt = addr;
            this.items.lft.opt.ctr.fr._data = addr;
            this.items.lft.opt.ctr.fr.value = addr;
        }
    } else {
        this.items.lft.opt.dts.to = { gx: gx, dt: dt };
        if (dt.ObjectID) {
            TSC.Mp.rt.to._dt = addr;
            this.items.lft.opt.ctr.to._data = addr;
            this.items.lft.opt.ctr.to.value = addr;
        }
    }

    if (kd == true && !dt.ObjectID)
        this.routeOptionGeo2Address(tp, gx);
};

MainUI.prototype.enableRouteControl = function (st) {
    this.items.lft.opt.ctr.bt.disabled = !st;
};

MainUI.prototype.switchMenuOpt = function (tp) {
    if (this.tab == tp)
        return false;
    var rt = TSC.getEl('lft-hdr-li-rt');
    var rs = TSC.getEl('lft-hdr-li-rs');
    rt = rt.getElementsByTagName('a');
    rs = rs.getElementsByTagName('a');
    if (tp == 1) {
        this.items.lft.opt.bnd.style.display = '';
        if (TSC.Sr.bound) {
            TSC.Sr.option.bound.style.display = 'none';
            TSC.Sr.bound.style.display = 'none';
        }
        if (this.items.lft.fin.bnd.style.display !== 'none') {
            this.items.lft.fin.bnd.style.display = 'none';
        }
        if (this.items.lft.opt.ctr.cl.style.display === 'none') {
            //this.items.lft.adv.bnd.style.display = '';
            this.items.lft.app.bnd.style.display = '';
            this.items.lft.adv.bnd.style.position = 'relative';
            this.items.lft.adv.bnd.style.visibility = 'visible';
            if (TSC.Rt.bound)
                TSC.Rt.bound.style.display = 'none';
            this.adjustAdvSize(tp);
            this.startAdv();
        } else {
            //this.items.lft.adv.bnd.style.display = 'none';
            this.items.lft.app.bnd.style.display = 'none';
            this.items.lft.adv.bnd.style.position = 'absolute';
            this.items.lft.adv.bnd.style.visibility = 'hidden';
            if (TSC.Rt.bound)
                TSC.Rt.bound.style.display = '';
        }

        TSC.addClass(rt[0], 'active');
        TSC.removeClass(rs[0], 'active');
    } else {
        this.items.lft.opt.bnd.style.display = 'none';
        if (TSC.Rt.bound)
            TSC.Rt.bound.style.display = 'none';

        if (this.items.lft.fin.bnd.style.display === 'none') {
            this.items.lft.fin.bnd.style.display = 'block';
        }

        if (TSC.Sr.sts == false) {
            //this.items.lft.adv.bnd.style.display = '';
            this.items.lft.app.bnd.style.display = '';
            this.items.lft.adv.bnd.style.position = 'relative';
            this.items.lft.adv.bnd.style.visibility = 'visible';
            if (TSC.Sr.bound) {
                TSC.Sr.option.bound.style.display = 'none';
                TSC.Sr.bound.style.display = 'none';
            }
            this.adjustAdvSize(tp);
            this.startAdv();
        } else {
            //this.items.lft.adv.bnd.style.display = 'none';
            this.items.lft.app.bnd.style.display = 'none';
            this.items.lft.adv.bnd.style.position = 'absolute';
            this.items.lft.adv.bnd.style.visibility = 'hidden';
            if (TSC.Sr.bound) {
                TSC.Sr.option.bound.style.display = '';
                TSC.Sr.bound.style.display = '';
            }
        }

        TSC.removeClass(rt[0], 'active');
        TSC.addClass(rs[0], 'active');
    }
    this.tab = tp;
    return true;
};

MainUI.prototype.adjustAdvSize = function (tp) {
    var dv = this.items.lft.adv.bnd.getElementsByTagName('div');
    var hh = this.size.cen.h - this.size.lpn.hdr.h - this.size.lpn.ftr.h - 32 - 10 - this.items.lft.app.height;
    if (tp == 1)
        hh = hh - this.size.lpn.opt.h;
    if (dv != null && dv.length > 0)
        dv[0].style.height = hh + 'px';
    else
        this.items.lft.adv.bnd.style.height = hh + 'px';
};

MainUI.prototype.searchAround = function (geo, dis) {
    this.switchMenuOpt(2);
};

MainUI.prototype.routeOptionGeo2Address = function (tp, gx) {
    $.ajax({
        url: "Engine/Business/Route/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'geo2add',
            lng: gx.lng(),
            lat: gx.lat()
        },
        success: function (dts) {
            if (dts.st) {
                //eval('dts.dt=' + TSC.Bs.decode(cdt(dts.dt)) + ';');
                if (tp) {
                    TSC.Mp.rt.fr._dt = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.fr._data = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.fr.value = dts.dt.Address;
                } else {
                    TSC.Mp.rt.to._dt = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.to._da = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.to.value = dts.dt.Address;
                }
            } else if (dts.dt === 3) {
                if (tp) {
                    TSC.Mp.rt.fr._dt = gx.lng().toFixed(6) + ', ' + gx.lat().toFixed(6);
                    TSC.UI.items.lft.opt.ctr.fr._data = gx.lng().toFixed(6) + ', ' + gx.lat().toFixed(6);
                    TSC.UI.items.lft.opt.ctr.fr.value = gx.lng().toFixed(6) + ', ' + gx.lat().toFixed(6);
                } else {
                    TSC.Mp.rt.to._dt = gx.lng().toFixed(6) + ', ' + gx.lat().toFixed(6);
                    TSC.UI.items.lft.opt.ctr.to._data = gx.lng().toFixed(6) + ', ' + gx.lat().toFixed(6);
                    TSC.UI.items.lft.opt.ctr.to.value = gx.lng().toFixed(6) + ', ' + gx.lat().toFixed(6);
                }
            }
            if (TSC.Mp.rt.fr && TSC.Mp.rt.to)
                TSC.Rt.startRouteBuyt(TSC.Mp.rt.fr.getPosition(), TSC.Mp.rt.to.getPosition());
        },
        error: function () {
            //alert( "AJAX - error()" );
        }
    });
};

MainUI.prototype.routeOptionAddress2Geo = function (tp, ky, kd) {
    if (g_placeChanged)
        return;
    this.enableRouteControl(false);
    $.ajax({
        url: "Engine/Business/Route/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'add2geo',
            key: ky
        },
        success: function (dts) {
            if (dts.st) {
                //eval('dts.dt=' + TSC.Bs.decode(cdt(dts.dt)) + ';');
                TSC.Mp.addRoutePoint(!kd, tp, new window.google.maps.LatLng(dts.dt.Geo.Lat, dts.dt.Geo.Lng));
                if (tp) {
                    TSC.Mp.rt.fr._dt = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.fr._data = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.fr.value = dts.dt.Address;
                } else {
                    TSC.Mp.rt.to._dt = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.to._data = dts.dt.Address;
                    TSC.UI.items.lft.opt.ctr.to.value = dts.dt.Address;
                }
                //if (TSC.Mp.rt.fr && TSC.Mp.rt.to)
                //    TSC.Rt.startRouteBuyt(TSC.Mp.rt.fr.getPosition(), TSC.Mp.rt.to.getPosition());
            }
            //else {
            //    //alert(ky);
            //}

            TSC.UI.enableRouteControl(true);
        },
        error: function () {
            //alert( "AJAX - error()" );
        }
    });
};

MainUI.prototype.routeOptionGoogleMap = function (tp, position, kd) {
    this.enableRouteControl(false);
    TSC.Mp.addRoutePoint(!kd, tp, position);
    TSC.UI.enableRouteControl(true);
};

function MyOverlay(map) { this.setMap(map); };
MyOverlay.prototype = new google.maps.OverlayView();
MyOverlay.prototype.onAdd = function () { };
MyOverlay.prototype.onRemove = function () { };
MyOverlay.prototype.draw = function () { };

function MapUI(el, sz) {
    this.el = el;
    this.sz = sz;
    this.rt = {};
    this.sr = {};
    this.ovl = [];
    this.Map = null;
    this.Dir = {};
    this.Con = { size: { w: 320, h: 240 } };

    this.initMap();
};

MapUI.prototype.initMap = function () {
    var binhanhNormal = 'binhanhnormal';
    var myOptions = {
        zoom: 13,
        minZoom: 5,
        //maxZoom: 15,
        center: new window.google.maps.LatLng(10.762622, 106.660172),
        scaleControl: true,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [binhanhNormal, window.google.maps.MapTypeId.ROADMAP, window.google.maps.MapTypeId.HYBRID],
            style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
    };

    var binhanh = new window.google.maps.ImageMapType({
        name: 'Transerco',
        minZoom: 5,
        maxZoom: 18,
        tileSize: new window.google.maps.Size(256, 256),
        getTileUrl: function (a, b) {
            return "http://map.binhanh.com.vn/titservice.ashx?typ=ba&lvl=" + b + "&top=" + a.y + "&left=" + a.x;
        }
    });

    this.Map = new window.google.maps.Map(this.el, myOptions);

    this.Map.mapTypes.set(binhanhNormal, binhanh);
    this.Map.Siz = this.sz;
    this.Map.Ovl = new MyOverlay(this.Map);

    window.google.maps.event.addListener(this.Map, 'click', function (evt) {
        TSC.Mn.hide();
    });

    window.google.maps.event.addListener(this.Map, 'dragstart', function (evt) {
        TSC.Mn.hide();
    });

    window.google.maps.event.addListener(this.Map, 'rightclick', function (evt) {
        this.geo = evt.latLng;
        var pts = this.Ovl.getProjection().fromLatLngToContainerPixel(evt.latLng);
        if (TSC.UI.items.lft.bnd.style.display === 'none')
            TSC.Mn.showAt({ x: pts.x, y: pts.y + this.Siz.top });
        else
            TSC.Mn.showAt({ x: pts.x + this.Siz.left, y: pts.y + this.Siz.top });
    });

    window.google.maps.event.addListener(this.Map, 'tilesloaded', function () {
        if (TSC.fr !== 2) {
            var ah = document.getElementsByTagName('a');
            for (var i = 0; i < ah.length; i++) {
                if (ah[i].href.indexOf('maps.google.com/maps') > -1) {
                    ah[i].style.display = 'none';
                    TSC.fr++;
                } else if (ah[i].href.indexOf('www.google.com') > -1 && ah[i].href.indexOf('chrome/browser/') < 0) {
                    ah[i].style.display = 'none';
                    TSC.fr++;
                }/*else if(ah[i].href.indexOf('www.google.com/intl/vi_US/help/terms_maps.html') > -1){
					ah[i].parentNode.parentNode.style.display = 'none';
					TSC.fr++;
				}*/
            }
        }
    });

    this.rt.wi = new window.google.maps.InfoWindow({ maxWidth: 380, content: '&nbsp;' });
};

MapUI.prototype.clearRouteBuyt = function () {
    if (this.rt.fr)
        this.rt.fr.setMap(null);
    if (this.rt.to)
        this.rt.to.setMap(null);

    this.rt.fr = null;
    this.rt.to = null;
};

MapUI.prototype.addRoutePoint = function (kd, tp, gx, dt) {
    if (!dt)
        dt = {};
    TSC.UI.items.lft.opt.ctr.cl.style.display = '';
    if (!kd)
        this.Map.setCenter(gx);
    if (tp) {
        if (!this.rt.fr) {
            this.rt.fr = new window.google.maps.Marker({
                position: gx,
                icon: 'images/route/marker_greenA.png',
                shadow: {
                    anchor: new window.google.maps.Point(15, 32),
                    url: 'images/home/shadow.png'
                },
                draggable: true,
                zIndex: 10,
                map: this.Map
            });

            this.rt.fr.scope = this;

            window.google.maps.event.addListener(this.rt.fr, 'click', function (evt) {
                this.scope.rt.wi.setContent(
                    '<div class="rt-info-win-start-end-title">Điểm xuất phát</div>' +
                    '<div class="rt-info-win-start-end-content">' + this._dt + '</div>' +
                    '<div class="rt-info-win-start-end-content">' + this.getPosition() + '</div>'
                );
                this.scope.rt.wi.open(this.scope.Map, this);
            });

            window.google.maps.event.addListener(this.rt.fr, 'dragstart', function (evt) {
                this.scope.rt.wi.close();
            });

            window.google.maps.event.addListener(this.rt.fr, 'dragend', function (evt) {
                TSC.UI.fillRouteGeo(true, true, evt.latLng, {});
                //if(TSC.Mp.rt.to)
                //	TSC.Rt.startRouteBuyt(evt.latLng, TSC.Mp.rt.to.getPosition());
            });
        } else {
            if (kd === false)
                this.rt.wi.close();
            this.rt.fr.setPosition(gx);
        }
    } else {
        if (!this.rt.to) {
            this.rt.to = new window.google.maps.Marker({
                position: gx,
                icon: 'images/route/marker_redB.png',
                shadow: {
                    anchor: new window.google.maps.Point(15, 32),
                    url: 'images/home/shadow.png'
                },
                draggable: true,
                zIndex: 10,
                map: this.Map
            });

            this.rt.to.scope = this;

            window.google.maps.event.addListener(this.rt.to, 'click', function (evt) {
                this.scope.rt.wi.setContent(
                    '<div class="rt-info-win-start-end-title">Điểm kết thúc</div>' +
                    '<div class="rt-info-win-start-end-content">' + this._dt + '</div>' +
                    '<div class="rt-info-win-start-end-content">' + this.getPosition() + '</div>'
                );
                this.scope.rt.wi.open(this.scope.Map, this);
            });

            window.google.maps.event.addListener(this.rt.to, 'dragstart', function (evt) {
                this.scope.rt.wi.close();
            });

            window.google.maps.event.addListener(this.rt.to, 'dragend', function (evt) {
                TSC.UI.fillRouteGeo(true, false, evt.latLng, {});
                //if(TSC.Mp.rt.fr)
                //	TSC.Rt.startRouteBuyt(TSC.Mp.rt.fr.getPosition(), evt.latLng);
            });
        } else {
            if (kd === false)
                this.rt.wi.close();
            this.rt.to.setPosition(gx);
        }
    }

    TSC.UI.fillRouteGeo(kd, tp, gx, dt);

    //if(this.rt.fr && this.rt.to){
    //	TSC.Rt.startRouteBuyt(this.rt.fr.getPosition(), this.rt.to.getPosition());
    //}
};

MapUI.prototype.revertRouteGeo = function () {
    if (!this.rt.fr || !this.rt.to)
        return;
    var dt = this.rt.fr._dt;
    this.rt.fr._dt = this.rt.to._dt;
    this.rt.to._dt = dt;
    var gx = this.rt.fr.getPosition();
    this.rt.fr.setPosition(this.rt.to.getPosition());
    this.rt.to.setPosition(gx);
    TSC.Rt.startRouteBuyt(this.rt.fr.getPosition(), this.rt.to.getPosition());
};

MapUI.prototype.startRouteBuyt = function () {
    if (this.rt.fr && this.rt.to) {
        var from = this.rt.fr.getPosition();
        var to = this.rt.to.getPosition();
        TSC.Rt.startRouteBuyt(from, to);
    }
};
MapUI.prototype.searchAddress = function (gx, add) {
    $('#lft-rt-opt-clr').trigger('click');
    if (!this.sr.mkAdd) {
        this.sr.mkAdd = new window.google.maps.Marker({
            position: gx,
            icon: {
                size: new window.google.maps.Size(34, 34),
                anchor: new window.google.maps.Point(17, 34),
                url: 'images/search/search-around.png'
            },
            draggable: true,
            map: this.Map
        });
        window.google.maps.event.addListener(this.sr.mkAdd,
            'dragstart',
            function (evt) {
                TSC.Mp.sr.infoWindow.close();
            });

        window.google.maps.event.addListener(this.sr.mkAdd,
            'dragend',
            function (evt) {
                //TSC.Mp.sr.mkAdd.setMap(null); //Cũ        
                var add = '';
                $.ajax({
                    url: "Engine/Business/Route/action.ashx",
                    type: "post",
                    dataType: "json",
                    data: {
                        act: 'geo2add',
                        lng: evt.latLng.lng(),
                        lat: evt.latLng.lat()
                    },
                    success: function (dts) {
                        if (dts.success) {
                            add = dts.dt.Address;
                            console.log(add);
                            TSC.Mp.searchAddress(evt.latLng, add);//*sign
                        }
                    },
                    error: function () {
                        //alert( "AJAX - error()" );
                    }
                });
            });
        cnew.style.display = '';
        this.sr.infoWindow = new window.google.maps.InfoWindow({ content: 'Địa chỉ hiện tại!' });
        this.sr.infoWindow.setContent(cnew);

        window.google.maps.event.addListener(this.sr.infoWindow,
            'closeclick',
            function (evt) {
                TSC.Mp.sr.mkAdd.setMap(null);
            });
    } else {
        this.sr.mkAdd.setOptions({ position: gx, map: this.Map });
        this.sr.infoWindow.setContent(cnew);
    }
    this.sr.infoWindow.setOptions({ position: gx, pixelOffset: new window.google.maps.Size(0, 0) });
    this.sr.infoWindow.open(this.Map, this.sr.mkAdd);
    //*sign rất là hay!
    $('#address').text(add);
    $('#lat').text(gx.lat());
    $('#long').text(gx.lng());
};
MapUI.prototype.searchAround = function (gx) {
    if (!this.sr.mk) {
        this.sr.mk = new window.google.maps.Marker({
            position: gx,
            icon: {
                size: new window.google.maps.Size(34, 34),
                anchor: new window.google.maps.Point(17, 34),
                url: 'images/search/search-around.png'
            },
            draggable: true,
            map: this.Map
        });

        window.google.maps.event.addListener(this.sr.mk, 'dragstart', function (evt) {
            TSC.Mp.sr.wi.close();
        });

        window.google.maps.event.addListener(this.sr.mk, 'dragend', function (evt) {
            TSC.Mp.sr.wi.setOptions({ position: evt.latLng, pixelOffset: new window.google.maps.Size(0, 0) });
            TSC.Mp.sr.wi.open(TSC.Mp.Map, TSC.Mp.sr.mk);
        });

        var cn = TSC.getEl('center-maps-search-aroud');
        cn.style.display = '';
        this.sr.wi = new window.google.maps.InfoWindow({ content: '&nbsp;' });
        this.sr.wi.setContent(cn);

        window.google.maps.event.addListener(this.sr.wi, 'closeclick', function (evt) {
            TSC.Mp.sr.mk.setMap(null);
        });
    } else {
        this.sr.mk.setOptions({ position: gx, map: this.Map });
    }

    this.sr.wi.setOptions({ position: gx, pixelOffset: new window.google.maps.Size(0, 0) });
    this.sr.wi.open(this.Map, this.sr.mk);
    $('#center-maps-search-aroud-dis').val('');
};

//*class RouteUI: Class để vẽ giao diện lộ trình
function RouteUI() {
    this.dom = null;
    this.dir = {};
    this.dts = [];
    this.items = {};
    this.result = { index: -1, plan: [] };
    this.initResultDom();
};

RouteUI.prototype.clearRouteBuyt = function () {
    TSC.getEl('alt-printf').style.display = 'none';
    for (var i = 0; i < this.dts.length; i++) {
        //Xóa đoạn đường đi bộ đến bến đầu tiên
        if (this.dts[i].Start.Pln)
            this.dts[i].Start.Pln.setMap(null);
        //Xóa các điểm dừng xe buýt
        if (this.dts[i].Station) {
            for (var j = 0; j < this.dts[i].Station.length; j++) {
                if (this.dts[i].Station[j].Marker)
                    this.dts[i].Station[j].Marker.setMap(null);
            }
        }
        //Kiểm tra xóa các đoạn đi bộ chuyển tuyến
        if (this.dts[i].Walk) {
            for (var j = 0; j < this.dts[i].Walk.length; j++) {
                if (this.dts[i].Walk[j].Pln)
                    this.dts[i].Walk[j].Pln.setMap(null);
            }
        }
        //Xóa đoạn đường đi bộ từ bến cuối đến điểm đích
        if (this.dts[i].End.Pln)
            this.dts[i].End.Pln.setMap(null);
        //Xóa các đoạn kết quả
        for (var j = 0; j < this.dts[i].Result.length; j++) {
            if (this.dts[i].Result[j].Pln) {
                if (this.dts[i].Result[j].Pln)
                    this.dts[i].Result[j].Pln.setMap(null);
            }
        }
    }

    if (this.dom) {
        while (this.dom.childNodes.length > 0)
            this.dom.removeChild(this.dom.childNodes[0]);
        this.result.plan = [];
    }
};

RouteUI.prototype.initResultDom = function () {
    if (this.dom == null) {
        this.bound = TSC.getEl('lft-rt-rlt-bnd');
        this.bound.style.width = (TSC.UI.size.lpn.w + 0) + 'px';
        this.bound.style.height = (TSC.UI.size.cen.h - TSC.UI.size.lpn.hdr.h - TSC.UI.size.lpn.opt.h - TSC.UI.size.lpn.ftr.h - 15) + 'px';

        this.dom = TSC.getEl('lft-rt-rlt-cnt');
        this.dom.style.width = (TSC.UI.size.lpn.w - 12) + 'px';
    }
};

RouteUI.prototype.renderResultWaiting = function () {
    this.initResultDom();
    var div = TSC.crtEl('div', 'ui-route-result-waiting');
    var img = TSC.crtEl('img', 'ui-route-result-waiting');
    img.src = TSC.url + 'images/route/waiting.gif';
    div.appendChild(img);
    this.dom.appendChild(div);
    this.bound.style.display = '';
};

RouteUI.prototype.renderResultNone = function () {
    TSC.getEl('alt-printf').style.display = 'none';
    this.initResultDom();

    while (this.dom.childNodes.length > 0)
        this.dom.removeChild(this.dom.childNodes[0]);

    var none = TSC.crtEl('div', 'ui-route-result-none');
    none.innerHTML = 'Không tìm thấy đường đi!';
    this.dom.appendChild(none);
};

RouteUI.prototype.startRouteBuyt = function (g1, g2) {
    //alert([g1, g2])
    TSC.UI.items.lft.app.bnd.style.display = 'none';
    TSC.UI.items.lft.adv.bnd.style.position = 'absolute';
    TSC.UI.items.lft.adv.bnd.style.visibility = 'hidden';

    this.clearRouteBuyt();
    this.renderResultWaiting();
    //Lấy dữ liệu lat lng của điểm
    var startLng = g1.lng().toFixed(6);
    var startLat = g1.lat().toFixed(6);
    var endLng = g2.lng().toFixed(6);
    var endLat = g2.lat().toFixed(6);
    var startAdd = TSC.Mp.rt.fr._dt;
    var endAdd = TSC.Mp.rt.to._dt;
    $.ajax({
        url: "Engine/Business/Route/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'route',
            slng: startLng,
            slat: startLat,
            sadd: startAdd,
            elng: endLng,
            elat: endLat,
            eadd: endAdd,
            opts: TSC.UI.items.lft.opt.ctr.tp.value
        },
        success: function (dts) {
            if (dts.st == true) {
                //eval('dts.dt=' + dts.dt + ';');
                TSC.Rt.dts = dts.dt;
                TSC.Rt.prepareDataRouteResult();
            } else {
                TSC.Rt.renderResultNone();
            }
            TSC.UI.enableRouteControl(true);
        },
        error: function () {
            //alert( "startRouteBuyt: AJAX - error()" );
        }
    });
};

RouteUI.prototype.prepareDataRouteResult = function () {
    TSC.getEl('alt-printf').style.display = '';
    while (this.dom.childNodes.length > 0)
        this.dom.removeChild(this.dom.childNodes[0]);
    var dts = [];
    var i = 0;
    for (i = 0; i < this.dts.length; i++) {
        var g1 = new window.google.maps.LatLng(this.dts[i].Start.Geo.Lat, this.dts[i].Start.Geo.Lng);
        var g2 = new window.google.maps.LatLng(this.dts[i].End.Geo.Lat, this.dts[i].End.Geo.Lng);

        for (var j = 0; j < this.dts[i].Result.length; j++) {
            var gs = new window.google.maps.LatLng(this.dts[i].Result[j].Start.Geo.Lat, this.dts[i].Result[j].Start.Geo.Lng);
            var ge = new window.google.maps.LatLng(this.dts[i].Result[j].End.Geo.Lat, this.dts[i].Result[j].End.Geo.Lng);

            //Đi bộ đến điểm đầu
            if (j === 0) {
                if (this.dts[i].Result[j].DistanceWalk > 5)
                    dts.push({ dx: i, st: true, g1: g1, g2: gs, wk: this.dts[i].Result[j].DistanceWalk });
                else {
                    this.dts[i].Start.Path = [g1, gs];
                    this.dts[i].Start.Distance = this.dts[i].Result[j].DistanceWalk;
                }
            }

            //Đi bộ chuyển tuyến
            if (j > 0 && this.dts[i].Result[j].Start.ObjectID != this.dts[i].Result[j - 1].End.ObjectID) {
                if (this.dts[i].Result[j].DistanceWalk > 5) {
                    dts.push({ dx: i, st: null, g1: new window.google.maps.LatLng(this.dts[i].Result[j - 1].End.Geo.Lat, this.dts[i].Result[j - 1].End.Geo.Lng), g2: gs, wk: this.dts[i].Result[j].DistanceWalk });
                }
                else {
                    this.dts[i].Start.Path = [new window.google.maps.LatLng(this.dts[i].Result[j - 1].End.Geo.Lat, this.dts[i].Result[j - 1].End.Geo.Lng), gs];
                    this.dts[i].Start.Distance = this.dts[i].Result[j].DistanceWalk;
                }
            }

            //Đi bộ đến điểm cuối
            if (j === this.dts[i].Result.length - 1) {
                if (this.dts[i].End.Distance > 5)
                    dts.push({ dx: i, st: false, g1: ge, g2: g2, wk: this.dts[i].End.Distance });
                else {
                    this.dts[i].End.Path = [ge, g2];
                    this.dts[i].End.Distance = this.dts[i].End.Distance;
                }
            }
        }
    }
    this.dts.WalkIndex = dts.length;
    if (this.dts.WalkIndex > 0) {
        for (var i = 0; i < dts.length; i++)
            this.processRouteWark(dts[i].dx, dts[i].st, dts[i].g1, dts[i].g2, dts[i].wk);
    } else {
        for (var i = 0; i < this.dts.length; i++)
            this.renderRouteResult(i, i == 0);

        this.adjustScrollResultDom();
    }
};

RouteUI.prototype.processRouteWark = function (dx, st, g1, g2, wk) {
    if (!this.dir.srv) {
        this.dir.srv = new google.maps.DirectionsService();
        this.dir.dpl = new google.maps.DirectionsRenderer();
        this.dir.dpl.setMap(TSC.Mp.Map);
    }

    var request = {
        origin: g1,
        destination: g2,
        travelMode: google.maps.TravelMode.WALKING
    };

    this.dir.srv.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            if (result.routes && result.routes.length > 0 && result.routes[0].overview_path && result.routes[0].overview_path.length > 1 && result.routes[0].overview_path[0].lat() > 20 && result.routes[0].overview_path[result.routes[0].overview_path.length - 1].lat() > 20) {
                if (st === true) {
                    TSC.Rt.dts[dx].Start.Path = result.routes[0].overview_path;
                    //TSC.Rt.dts[dx].Start.Distance = result.routes[0].legs[0].distance.value;
                    TSC.Rt.dts[dx].Start.Distance = wk;
                } else if (st === false) {
                    TSC.Rt.dts[dx].End.Path = result.routes[0].overview_path;
                    //TSC.Rt.dts[dx].End.Distance = result.routes[0].legs[0].distance.value;
                    TSC.Rt.dts[dx].End.Distance = wk;
                } else {
                    if (!TSC.Rt.dts[dx].Walk)
                        TSC.Rt.dts[dx].Walk = [];
                    TSC.Rt.dts[dx].Walk.push({
                        Path: result.routes[0].overview_path,
                        //Distance: result.routes[0].legs[0].distance.value
                        Distance: wk
                    });
                }
            } else {
                if (st === true) {
                    TSC.Rt.dts[dx].Start.Path = [g1, g2];
                    //TSC.Rt.dts[dx].Start.Distance = 0;
                    TSC.Rt.dts[dx].Start.Distance = wk;
                } else if (st === false) {
                    TSC.Rt.dts[dx].End.Path = [g1, g2];
                    //TSC.Rt.dts[dx].End.Distance = 0;
                    TSC.Rt.dts[dx].End.Distance = wk;
                } else {
                    if (!TSC.Rt.dts[dx].Walk)
                        TSC.Rt.dts[dx].Walk = [];
                    TSC.Rt.dts[dx].Walk.push({
                        Path: [g1, g2],
                        Distance: wk
                    });
                }
            }
        } else {
            if (st === true) {
                TSC.Rt.dts[dx].Start.Path = [g1, g2];
                //TSC.Rt.dts[dx].Start.Distance = 0;
                TSC.Rt.dts[dx].Start.Distance = wk;
            } else if (st === false) {
                TSC.Rt.dts[dx].End.Path = [g1, g2];
                //TSC.Rt.dts[dx].End.Distance = 0;
                TSC.Rt.dts[dx].End.Distance = wk;
            } else {
                if (!TSC.Rt.dts[dx].Walk)
                    TSC.Rt.dts[dx].Walk = [];
                TSC.Rt.dts[dx].Walk.push({
                    Path: [g1, g2],
                    Distance: wk
                });
            }
        }

        TSC.Rt.dts.WalkIndex--;
        if (TSC.Rt.dts.WalkIndex == 0) {
            for (var i = 0; i < TSC.Rt.dts.length; i++)
                TSC.Rt.renderRouteResult(i, i == 0);

            TSC.Rt.adjustScrollResultDom();
        }
    });
};

RouteUI.prototype.renderRouteResult = function (dx, st) {
    this.dts[dx].Bound = new window.google.maps.LatLngBounds();
    //Gán thông tin điểm đầu điểm cuối
    this.dts[dx].Start.Address = TSC.UI.items.lft.opt.ctr.fr.value;
    this.dts[dx].End.Address = TSC.UI.items.lft.opt.ctr.to.value;
    //Hiệu chỉnh điểm đầu + Hiệu chỉnh điểm cuối
    if (st == true) {
        if (this.dts[dx].Start.Path && this.dts[dx].Start.Path.length > 0)
            TSC.Mp.rt.fr.setPosition(this.dts[dx].Start.Path[0]);
        if (this.dts[dx].End.Path && this.dts[dx].End.Path.length > 0)
            TSC.Mp.rt.to.setPosition(this.dts[dx].End.Path[this.dts[dx].End.Path.length - 1]);

        //Thêm điểm đầu điểm cuối để hiển thị
        this.dts[dx].Bound.extend(TSC.Mp.rt.fr.getPosition());
        this.dts[dx].Bound.extend(TSC.Mp.rt.to.getPosition());
    }

    //Vẽ đoạn đường đi bộ từ điểm bắt đầu đến bến xe buýt đầu tiên	
    if (this.dts[dx].Start.Path && this.dts[dx].Start.Path.length > 0) {
        this.dts[dx].Start.Pln = new window.google.maps.Polyline({
            path: this.dts[dx].Start.Path,
            strokeColor: 'black',
            strokeOpacity: .6,
            strokeWeight: 3,
            map: st ? TSC.Mp.Map : null
        });

        //Hiệu chỉnh đường bound để hiển thị hết kết quả
        for (var i = 0; i < this.dts[dx].Start.Path.length; i++)
            this.dts[dx].Bound.extend(this.dts[dx].Start.Path[i]);
    }

    //Vẽ các đoạn đi bộ khi chuyển bến
    if (this.dts[dx].Walk) {
        for (var i = 0; i < this.dts[dx].Walk.length; i++) {
            this.dts[dx].Walk[i].Pln = new window.google.maps.Polyline({
                path: this.dts[dx].Walk[i].Path,
                strokeColor: 'black',
                strokeOpacity: .6,
                strokeWeight: 3,
                map: st ? TSC.Mp.Map : null
            });

            //Hiệu chỉnh đường bound để hiển thị hết kết quả
            for (var j = 0; j < this.dts[dx].Walk[i].Path.length; j++)
                this.dts[dx].Bound.extend(this.dts[dx].Walk[i].Path[j]);
        }
    }

    //Vẽ đoạn đường đi bộ từ bến xe buýt cuối cùng đến điểm kết thúc
    if (this.dts[dx].End.Path && this.dts[dx].End.Path.length > 0) {
        this.dts[dx].End.Pln = new window.google.maps.Polyline({
            path: this.dts[dx].End.Path,
            strokeColor: 'black',
            strokeOpacity: .6,
            strokeWeight: 3,
            map: st ? TSC.Mp.Map : null
        });

        //Hiệu chỉnh đường bound để hiển thị hết kết quả
        for (var i = 0; i < this.dts[dx].End.Path.length; i++)
            this.dts[dx].Bound.extend(this.dts[dx].End.Path[i]);
    }

    if (!this.dts[dx].Station)
        this.dts[dx].Station = [];

    if (this.dts[dx].Start.Path && this.dts[dx].Start.Path.length > 0) {
        this.dts[dx].Station.push({
            ObjectID: this.dts[dx].Result[0].Start.ObjectID,
            Marker: new window.google.maps.Marker({
                position: this.dts[dx].Start.Path[this.dts[dx].Start.Path.length - 1],
                icon: {
                    size: new window.google.maps.Size(31, 28),
                    anchor: new window.google.maps.Point(0, 28),
                    url: 'images/route/map-icon-buyt.png'
                },
                zIndex: 11,
                map: st ? TSC.Mp.Map : null
            })
        });

        //this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = this.dts[dx].Result.length > 0 ? this.dts[dx].Result[0].Start.Name : '&nbsp';
        this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker.scope = TSC.Mp;
        this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = {
            ObjectID: this.dts[dx].Result[0].Start.ObjectID,
            FleetList: this.dts[dx].Result[0].Fleet.join(),
            FleetOver: this.dts[dx].Result[0].Start.FleetOver,
            Name: this.dts[dx].Result.length > 0 ? this.dts[dx].Result[0].Start.Name : '&nbsp',
            Geo: { Lng: this.dts[dx].Start.Path[this.dts[dx].Start.Path.length - 1].lng(), Lat: this.dts[dx].Start.Path[this.dts[dx].Start.Path.length - 1].lat() }
        };

        window.google.maps.event.addListener(this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker, 'click', function (evt) {
            var con = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                '<div class="rt-info-win-start-end-content">' + this._dt.Name + '</div>';
            this.scope.rt.wi.setContent(TSC.renderInfoWindowContent(2, con, this._dt));
            this.scope.rt.wi.open(this.scope.Map, this);
        });
    }

    if (this.dts[dx].End.Path && this.dts[dx].End.Path.length > 0) {
        this.dts[dx].Station.push({
            ObjectID: this.dts[dx].Result[this.dts[dx].Result.length - 1].End.ObjectID,
            Marker: new window.google.maps.Marker({
                position: this.dts[dx].End.Path[0],
                icon: {
                    size: new window.google.maps.Size(31, 28),
                    anchor: new window.google.maps.Point(0, 28),
                    url: 'images/route/map-icon-walk.png'
                },
                zIndex: 11,
                map: st ? TSC.Mp.Map : null
            })
        });

        //this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = this.dts[dx].Result.length > 0 ? this.dts[dx].Result[this.dts[dx].Result.length - 1].End.Name : '&nbsp';
        this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker.scope = TSC.Mp;
        this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = {
            ObjectID: this.dts[dx].Result[this.dts[dx].Result.length - 1].End.ObjectID,
            FleetList: this.dts[dx].Result[this.dts[dx].Result.length - 1].Fleet.join(),
            FleetOver: this.dts[dx].Result[this.dts[dx].Result.length - 1].End.FleetOver,
            Name: this.dts[dx].Result.length > 0 ? this.dts[dx].Result[this.dts[dx].Result.length - 1].End.Name : '&nbsp',
            Geo: { Lng: this.dts[dx].End.Path[0].lng(), Lat: this.dts[dx].End.Path[0].lat() }
        };

        window.google.maps.event.addListener(this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker, 'click', function (evt) {
            var con = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                '<div class="rt-info-win-start-end-content">' + this._dt.Name + '</div>';
            this.scope.rt.wi.setContent(TSC.renderInfoWindowContent(2, con, this._dt));
            this.scope.rt.wi.open(this.scope.Map, this);
        });
    }

    //Vẽ các đoạn đi xe buýt	
    for (var i = 0; i < this.dts[dx].Result.length; i++) {
        var pts = [];
        for (var j = 0; j < this.dts[dx].Result[i].Path.length; j++) {
            pts.push(new window.google.maps.LatLng(this.dts[dx].Result[i].Path[j].Lat, this.dts[dx].Result[i].Path[j].Lng));
            //Hiệu chỉnh đường bound để hiển thị hết kết quả
            this.dts[dx].Bound.extend(pts[pts.length - 1]);
        }

        if (i > 0) {
            this.dts[dx].Station.push({
                ObjectID: this.dts[dx].Result[i].Start.ObjectID,
                Marker: new window.google.maps.Marker({
                    position: pts[0],
                    icon: {
                        size: new window.google.maps.Size(31, 28),
                        anchor: new window.google.maps.Point(0, 28),
                        url: 'images/route/map-icon-buyt.png'
                    },
                    map: st ? TSC.Mp.Map : null
                })
            });

            //this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = this.dts[dx].Result.length > 0 ? this.dts[dx].Result[i].Start.Name : '&nbsp';
            this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker.scope = TSC.Mp;
            this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = {
                ObjectID: this.dts[dx].Result[i].Start.ObjectID,
                FleetList: this.dts[dx].Result[i].Fleet.join(),
                FleetOver: this.dts[dx].Result[i].Start.FleetOver,
                Name: this.dts[dx].Result.length > 0 ? this.dts[dx].Result[i].Start.Name : '&nbsp',
                Geo: { Lng: pts[0].lng(), Lat: pts[0].lat() }
            };

            window.google.maps.event.addListener(this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker, 'click', function (evt) {
                //this.scope.rt.wi.setContent('<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div><div class="rt-info-win-start-end-content">'+this._dt+'</div>');
                var con = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                    '<div class="rt-info-win-start-end-content">' + this._dt.Name + '</div>';
                this.scope.rt.wi.setContent(TSC.renderInfoWindowContent(2, con, this._dt));
                this.scope.rt.wi.open(this.scope.Map, this);
            });
        }
        var arrayColor = [];
        arrayColor.push('#006400');
        arrayColor.push('#0000FF');
        arrayColor.push('#2F4F4F');
        arrayColor.push('#10b3ee');
        arrayColor.push('#1c4655');
        arrayColor.push('#b61acd');
        arrayColor.push('#040512');
        arrayColor.push('#252703');
        this.dts[dx].Result[i].Pln = new window.google.maps.Polyline({
            path: pts,
            strokeColor: arrayColor[i],
            strokeOpacity: i == 1 ? .4 : .6,
            strokeWeight: 6,
            map: st ? TSC.Mp.Map : null
        });

        if (i < this.dts[dx].Result.length - 1 && this.dts[dx].Result[i].End.ObjectID != this.dts[dx].Result[i + 1].Start.ObjectID) {
            this.dts[dx].Station.push({
                ObjectID: this.dts[dx].Result[i].End.ObjectID,
                Marker: new window.google.maps.Marker({
                    position: pts[pts.length - 1],
                    icon: {
                        size: new window.google.maps.Size(31, 28),
                        anchor: new window.google.maps.Point(0, 28),
                        url: this.dts[dx].Result[i].End.ObjectID !== this.dts[dx].Result[i + 1].Start.ObjectID ? 'images/route/map-icon-walk.png' : 'images/route/map-icon-buyt.png'
                    },
                    map: st ? TSC.Mp.Map : null
                })
            });

            //this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = this.dts[dx].Result.length > 0 ? this.dts[dx].Result[i].End.Name : '&nbsp';
            this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker.scope = TSC.Mp;
            this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = {
                ObjectID: this.dts[dx].Result[i].End.ObjectID,
                FleetList: this.dts[dx].Result[i].Fleet.join(),
                FleetOver: this.dts[dx].Result[i].End.FleetOver,
                Name: this.dts[dx].Result.length > 0 ? this.dts[dx].Result[i].End.Name : '&nbsp',
                Geo: { Lng: pts[pts.length - 1].lng(), Lat: pts[pts.length - 1].lat() }
            };

            window.google.maps.event.addListener(this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker, 'click', function (evt) {
                //this.scope.rt.wi.setContent('<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div><div class="rt-info-win-start-end-content">'+this._dt+'</div>');
                var con = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                    '<div class="rt-info-win-start-end-content">' + this._dt.Name + '</div>';
                this.scope.rt.wi.setContent(TSC.renderInfoWindowContent(2, con, this._dt));
                this.scope.rt.wi.open(this.scope.Map, this);
            });
        }

        //Vẽ các điểm dừng trên đoạn đường đó
        if (this.dts[dx].Result[i].Station != null) {
            for (var j = 0; j < this.dts[dx].Result[i].Station.length; j++) {
                this.dts[dx].Station.push({
                    ObjectID: this.dts[dx].Result[i].Station[j].ObjectID,
                    Marker: new window.google.maps.Marker({
                        position: new window.google.maps.LatLng(this.dts[dx].Result[i].Station[j].Geo.Lat, this.dts[dx].Result[i].Station[j].Geo.Lng),
                        icon: {
                            size: new window.google.maps.Size(10, 10),
                            anchor: new window.google.maps.Point(5, 5),
                            url: 'images/route/map-icon-buyt-over.png'
                        },
                        map: st ? TSC.Mp.Map : null
                    })
                });

                this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker.scope = TSC.Mp;
                this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt = this.dts[dx].Result[i].Station[j];
                this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker._dt.FleetList = this.dts[dx].Result[i].Fleet.join();

                window.google.maps.event.addListener(this.dts[dx].Station[this.dts[dx].Station.length - 1].Marker, 'click', function (evt) {
                    var con = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                        '<div class="rt-info-win-start-end-content">' + this._dt.Name + '</div>';
                    this.scope.rt.wi.setContent(TSC.renderInfoWindowContent(2, con, this._dt));
                    this.scope.rt.wi.open(this.scope.Map, this);
                });
            }
        }
    }

    //Kiểm tra view bản đồ thấy toàn bộ lộ trình đường đi
    if (st) {
        /*
		var b = new google.maps.LatLngBounds();
		b.extend(this.dts[dx].Start.Path[0]);
		b.extend(this.dts[dx].End.Path[this.dts[dx].End.Path.length-1]);
		TSC.Mp.Map.fitBounds(b);
		*/
        TSC.Mp.Map.fitBounds(this.dts[dx].Bound);
    }

    this.initResultDom();

    //Vẽ kết quả
    this.renderResultItem(dx, st);
};

RouteUI.prototype.visibleRouteResult = function (dx, st) {
    //Vẽ đoạn đường đi bộ từ điểm bắt đầu đến bến xe buýt đầu tiên
    if (this.dts[dx].Start.Pln)
        this.dts[dx].Start.Pln.setMap(st ? TSC.Mp.Map : null);
    //Vẽ các đoạn đi bộ khi chuyển bến
    if (this.dts[dx].Walk) {
        for (var i = 0; i < this.dts[dx].Walk.length; i++)
            this.dts[dx].Walk[i].Pln.setMap(st ? TSC.Mp.Map : null);
    }
    //Vẽ đoạn đường đi bộ từ bến xe buýt cuối cùng đến điểm kết thúc
    if (this.dts[dx].End.Pln)
        this.dts[dx].End.Pln.setMap(st ? TSC.Mp.Map : null);
    //Các điểm dừng trung gian
    if (this.dts[dx].Station) {
        for (var i = 0; i < this.dts[dx].Station.length; i++)
            this.dts[dx].Station[i].Marker.setMap(st ? TSC.Mp.Map : null);
    }
    //Các đoạn đường đi xe buýt
    if (this.dts[dx].Result) {
        for (var i = 0; i < this.dts[dx].Result.length; i++)
            this.dts[dx].Result[i].Pln.setMap(st ? TSC.Mp.Map : null);
    }
    if (st)
        TSC.Mp.Map.fitBounds(this.dts[dx].Bound);
};

RouteUI.prototype.renderResultItem = function (dx, st) {
    //Tính tổng khoảng cách
    var dist = 0;

    var i = 0;
    //Khoảng cách đi bộ từ điểm đầu đến điểm dừng đầu tiên
    dist += this.dts[dx].Start.Distance;
    //Khoảng cách đi xe buýt
    for (i = 0; i < this.dts[dx].Result.length; i++)
        dist += this.dts[dx].Result[i].Distance;
    //Khoảng cách đi bộ chuyển tuyến
    if (this.dts[dx].Walk) {
        for (i = 0; i < this.dts[dx].Walk.length; i++)
            dist += this.dts[dx].Walk[i].Distance;
    }
    //Khoảng cách đi bộ từ điểm dừng cuối đến điểm đích
    dist += this.dts[dx].End.Distance;
    //Tạo tiêu đề chung cho một kết quả tìm kiếm
    var title = TSC.crtEl('div', 'ui-route-result-item-title-' + (st ? 'focus' : 'none'));
    title.id = 'tsc-route-result-display-0' + this.result.plan.length + '-title';

    var pa = TSC.crtEl('div', 'ui-route-result-item-pa-left');

    //Phương án
    pa.appendChild(this.createRecordPlanIndex(dx));
    //Đoạn đi bộ đầu tiên
    if (this.dts[dx].Start.Distance > 5)
        pa.appendChild(this.createRecordStart());


    //Các tuyến cần đi
    var isWeekend = false;
    for (i = 0; i < this.dts[dx].Result.length; i++) {
        if (i > 0 && this.dts[dx].Result[i].Start.ObjectID !== this.dts[dx].Result[i - 1].End.ObjectID) {
            //Đoạn đi bộ khi chuyển tuyến
            pa.appendChild(this.createRecordWalk());
        }

        var fleet = this.dts[dx].Result[i].Fleet.toString();
        //Thông tin tuyến cần đi
        pa.appendChild(this.createRecordBus(fleet));

        if (TSC.fleetCodeWeekend.indexOf(fleet) >= 0) {
            isWeekend = true;
        }
    }
    //Đoạn đi bộ đến điểm cuối
    if (this.dts[dx].End.Distance > 5)
        pa.appendChild(this.createRecordWalk());

    //Các thông tin kèm theo
    pa.scope = this;
    pa.focus = false;
    pa.index = this.result.plan.length;
    pa.onclick = this.clickResultItemHeader;

    title.appendChild(pa);
    //Tổng đường đi
    title.appendChild(this.createRecordTotal(dist, isWeekend));

    this.dom.appendChild(title);



    //Tạo nội dung chi tiết cho một kết quả tìm kiếm
    var detail = TSC.crtEl('div', 'ui-route-result-item-detail');
    detail.id = 'tsc-route-result-display-0' + this.result.plan.length + '-detail';
    if (dx > 0)
        detail.style.display = 'none';
    else
        this.index = 0;
    //Tạo điểm đầu
    detail.appendChild(this.drawDetailStartEnd(true, this.dts[dx].Start));
    //Tạo đoạn đi bộ đến điểm đầu
    if (this.dts[dx].Start.Distance > 5)
        detail.appendChild(this.drawDetailWalk(true, this.dts[dx].Result[0].Start.Name, '', this.dts[dx].Start.Distance));
    //Duyệt tạo các đoạn đi xe buýt
    var walk = 0;
    for (i = 0; i < this.dts[dx].Result.length; i++) {
        var buyt = this.drawDetailBuyt(this.dts[dx].Result[i].Start.Name, this.dts[dx].Result[i].Fleet.toString(), this.dts[dx].Result[i].Distance, this.dts[dx].Result[i].Time);
        buyt.dts = { tp: 1, dx: dx, dt: this.dts[dx].Result[i].Start.ObjectID, gx: this.dts[dx].Result[i].Start.Geo };
        buyt.onclick = this.clickDetailItemRouteBuyt;
        detail.appendChild(buyt);
        if (i < this.dts[dx].Result.length - 1 && this.dts[dx].Result[i].End.ObjectID !== this.dts[dx].Result[i + 1].Start.ObjectID) {
            var walkmidd = 0;
            try {
                walkmidd = this.drawDetailWalk(false, this.dts[dx].Result[i].End.Name, this.dts[dx].Result[i + 1].Start.Name, this.dts[dx].DistWalk);
            } catch (ex) { alert([this.dts.length, dx, this.dts[dx].Walk, walk]) }
            walkmidd.dts = { tp: 1, dx: dx, dt: this.dts[dx].Result[i].End.ObjectID, gx: this.dts[dx].Result[i].End.Geo };
            walkmidd.onclick = this.clickDetailItemRouteBuyt;
            detail.appendChild(walkmidd);
        }
    }
    //Tạo đoạn đi bộ đến điểm cuối
    if (this.dts[dx].End.Distance > 5) {
        var walkend = this.drawDetailWalk(false, this.dts[dx].Result[this.dts[dx].Result.length - 1].End.Name, this.dts[dx].End.Address, this.dts[dx].End.Distance);
        walkend.dts = { tp: 1, dx: dx, dt: this.dts[dx].Result[this.dts[dx].Result.length - 1].End.ObjectID, gx: this.dts[dx].Result[this.dts[dx].Result.length - 1].End.Geo };
        walkend.onclick = this.clickDetailItemRouteBuyt;
        detail.appendChild(walkend);
    }
    //Tạo điểm cuối
    detail.appendChild(this.drawDetailStartEnd(false, this.dts[dx].End));

    this.dom.appendChild(detail);

    //Thêm vào phần quản lý
    this.result.plan.push({ title: title, detail: detail });
};

RouteUI.prototype.clickResultItemHeader = function () {
    if (this.index == this.scope.index)
        return;
    if (this.scope.index > -1) {
        this.scope.result.plan[this.scope.index].title.focus = false;
        this.scope.result.plan[this.scope.index].title.className = 'ui-route-result-item-title-none';
        this.scope.result.plan[this.scope.index].detail.style.display = 'none';

        this.scope.visibleRouteResult(this.scope.index, false);
    }
    if (this.focus) {
        this.parentElement.className = 'ui-route-result-item-title-none';
        this.scope.result.plan[this.index].detail.style.display = 'none';

        this.scope.visibleRouteResult(this.index, false);
    } else {
        this.parentElement.className = 'ui-route-result-item-title-focus';
        this.scope.result.plan[this.index].detail.style.display = '';
        this.scope.visibleRouteResult(this.index, true);
    }
    this.focus = !this.focus;
    if (this.focus)
        this.scope.index = this.index;
    else
        this.scope.index = -1;

    this.scope.adjustScrollResultDom();
};

RouteUI.prototype.adjustScrollResultDom = function () {
    var bs = TSC.getObjectSize(this.bound);
    var ds = TSC.getObjectSize(this.dom);

    if (ds.h > bs.h) {
        this.bound.style.overflowY = 'scroll';
        this.dom.style.width = (TSC.UI.views.left - 15) + 'px';
    } else {
        this.bound.style.overflowY = 'hidden';
        this.dom.style.width = (TSC.UI.views.left - 5) + 'px';
    }
};

RouteUI.prototype.createRecordPlanIndex = function (dx) {
    var bg = TSC.crtEl('span', 'no-wrap');
    var ic = TSC.crtEl('img', 'ui-route-result-item-title-plan');
    ic.idx = dx;
    ic.src = TSC.url + 'images/route/plan-index-0' + (dx + 1) + '.png';
    //ic.onclick = this.clickRoutePlanIndex;
    bg.appendChild(ic);
    return bg;
};

RouteUI.prototype.clickRoutePlanIndex = function () {
    TSC.Pr.printfResult(this.idx);
};

RouteUI.prototype.createRecordStart = function () {
    var bg = TSC.crtEl('span', 'no-wrap');
    var wk = TSC.crtEl('div', 'ui-route-result-item-title-line');
    var ic = TSC.crtEl('img', 'ui-route-result-item-title-line-icon');

    ic.src = TSC.url + 'images/route/walk.png';
    ic.alt = 'Di chuyển';
    wk.title = 'Di chuyển';

    wk.appendChild(ic);
    bg.appendChild(wk);

    return bg;
};
/*
<span class="no-wrap">
	<img class="altroute-arrw-lr" width="8" height="9" src="//maps.gstatic.com/mapfiles/transparent.png">
	<div class="trtline" title="28">
		<img class="trtline-icon" alt="Xe buýt" src="//maps.gstatic.com/mapfiles/transit/iw2/7/bus.png">
		<span class="trtline-name">28</span>
	</div>
</span>
...
<span class="no-wrap">
	<img class="altroute-arrw-lr" width="8" height="9" src="//maps.gstatic.com/mapfiles/transparent.png">
	<div class="trtline" title="08">
		<img class="trtline-icon" alt="Xe buýt" src="//maps.gstatic.com/mapfiles/transit/iw2/7/bus.png">
		<span class="trtline-name">08</span>
	</div>
</span>
*/
RouteUI.prototype.createRecordBus = function (tx) {
    var bg = TSC.crtEl('span', 'no-wrap');
    var ar = TSC.crtEl('img', 'ui-route-result-item-title-arrow');
    var bs = TSC.crtEl('div', 'ui-route-result-item-title-line');
    var ic = TSC.crtEl('img', 'ui-route-result-item-title-line-icon');
    var cd = TSC.crtEl('span', 'ui-route-result-item-title-line-name');

    ar.style.width = '8px';
    ar.style.height = '9px';
    ar.src = TSC.url + 'images/route/transparent.png';

    ic.src = TSC.url + 'images/route/bus.png';
    ic.alt = 'Xe buýt';
    cd.innerHTML = tx;

    bs.title = tx;

    bs.appendChild(ic);
    bs.appendChild(cd);

    bg.appendChild(ar);
    bg.appendChild(bs);

    return bg;
};
/*
<span class="no-wrap">
	<img class="altroute-arrw-lr" width="8" height="9" src="//maps.gstatic.com/mapfiles/transparent.png">
	<div class="trtline" title="Đi bộ">
		<img class="trtline-icon" alt="Đi bộ" src="//maps.gstatic.com/mapfiles/transit/iw2/7/walk.png">
	</div>
</span>
*/
RouteUI.prototype.createRecordWalk = function () {
    var bg = TSC.crtEl('span', 'no-wrap');
    var ar = TSC.crtEl('img', 'ui-route-result-item-title-arrow');
    var wk = TSC.crtEl('div', 'ui-route-result-item-title-line');
    var ic = TSC.crtEl('img', 'ui-route-result-item-title-line-icon');

    ar.style.width = '8px';
    ar.style.height = '9px';
    ar.src = TSC.url + 'images/route/transparent.png';

    ic.src = TSC.url + 'images/route/walk.png';
    ic.alt = 'Di chuyển';

    wk.title = 'Di chuyển';
    wk.appendChild(ic);

    bg.appendChild(ar);
    bg.appendChild(wk);

    return bg;
};

RouteUI.prototype.createRecordTotal = function (tx, iwk) {
    var tt = TSC.crtEl('div', 'altroute-rcol');
    tt.innerHTML = TSC.roundDistanceIsWeekend(tx, iwk);
    return tt;
};

/*
RouteUI.prototype.processRouteWarkBK = function(st, dx, g1, g2){
	if(!this.dir.srv){
		this.dir.srv = new google.maps.DirectionsService();
		this.dir.dpl = new google.maps.DirectionsRenderer();
		this.dir.dpl.setMap(TSC.Mp.Map);
	}
	
	var request = {
		origin: g1,
		destination: g2,
		travelMode: google.maps.TravelMode.WALKING
	};
	
	this.dir.srv.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			//result.routes[0].legs[0].distance.value
			if(result.routes && result.routes.length > 0 && result.routes[0].overview_path && result.routes[0].overview_path.length > 0)
				TSC.Rt.drawRouteWark(st, dx, g1, g2, result.routes[0].overview_path);
		}
	});
};

RouteUI.prototype.drawRouteWark = function(sts, idx, gx1, gx2, pts){
	if(sts === true)
		TSC.Mp.rt.fr.setPosition(pts[0]);
	else if(sts === false)
		TSC.Mp.rt.to.setPosition(pts[pts.length-1]);
	if(this.dir.pln[idx])
		this.dir.pln[idx].setPath(pts);
	else{
		this.dir.pln[idx] = new google.maps.Polyline({
			path: pts,
			strokeColor: 'blue',
			strokeOpacity: .4,
			strokeWeight: 4,
			map: TSC.Mp.Map
		});
	}
};
*/
/*
<div id="panel_ddw0" class="ddwpt" oi="wi0">
<table class="ddwpt-table">
<tbody>
<tr>
<td class="ddptlnk">
<div class="vline-dotted"></div>
<img class="ddptlnk-img" width="20" height="34" src="https://maps.gstatic.com/mapfiles/markers2/marker_greenA.png">
</td>
<td class="ddw-addr">
<div id="ddw_addr_area_0" class="value">
<div id="sxaddr" class="dir-dw-space">
<div class="sa dir-dp-wayaddr" dir="ltr">Đường không xác định</div>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>
*/
RouteUI.prototype.drawDetailStartEnd = function (st, dt) {
    //var bd = TSC.crtEl('div', '');
    var tb = TSC.crtEl('table', 'ui-route-result-item-start-end');
    var bd = TSC.crtEl('tbody', '');
    var tr = TSC.crtEl('tr', '');
    var ti = TSC.crtEl('td', '');
    var tt = TSC.crtEl('td', '');
    var im = TSC.crtEl('img', '');

    if (st)
        im.src = TSC.url + 'images/route/marker_greenA.png';
    else
        im.src = TSC.url + 'images/route/marker_redB.png';

    ti.appendChild(im);

    tt.innerHTML = '<b>' + dt.Address + '</b>';

    tr.appendChild(ti);
    tr.appendChild(tt);

    bd.appendChild(tr);
    tb.appendChild(bd);
    tb.dts = { tp: 0, dt: st, gx: dt.Geo };
    tb.onclick = this.clickDetailItemRouteBuyt;

    return tb;
};

RouteUI.prototype.clickDetailItemRouteBuyt = function () {
    TSC.Mp.Map.panTo(new window.google.maps.LatLng(this.dts.gx.Lat, this.dts.gx.Lng));
    if (this.dts.tp === 0) {
        if (this.dts.dt === true)
            window.google.maps.event.trigger(TSC.Mp.rt.fr, 'click', []);
        else
            window.google.maps.event.trigger(TSC.Mp.rt.to, 'click', []);
    } else if (this.dts.tp === 1) {
        for (var i = 0; i < TSC.Rt.dts[this.dts.dx].Station.length; i++) {
            if (TSC.Rt.dts[this.dts.dx].Station[i].ObjectID === this.dts.dt) {
                window.google.maps.event.trigger(TSC.Rt.dts[this.dts.dx].Station[i].Marker, 'click', []);
                break;
            }
        }
    }
};

RouteUI.prototype.drawDetailBuyt = function (nm, fn, ds, ts) {
    var s = '<table width="100%" style="cursor:pointer;">' +
        '	<tbody>' +
        '		<tr>' +
        '			<td class="dir-ts-empty-top"></td>' +
        '		</tr>' +
        '		<tr>' +
        '			<td width="20">&nbsp;</td>' +
        '			<td>' +
        '				<b><span>' + nm + '</span></b>' +
        '			</td>' +
        '		</tr>' +
        '		<tr>' +
        '			<td width="20">&nbsp;</td>' +
        '			<td>' +
        '				<div class="dir-ts-icon">' +
        '					<div class="ui-route-result-item-title-line" title="Xe buýt">' +
        '						<img class="ui-route-result-item-title-line-icon" alt="Xe buýt" src="' + TSC.url + 'images/route/bus.png">' +
        '					    <span class="action">Đi xe buýt tuyến</span>' +
        '						<span class="ui-route-result-item-title-line-name">' + fn + '</span>' +
        '					</div>' +
        '				</div>' +
        '			</td>' +
        '		</tr>' +
        '		<tr>' +
        '			<td width="20">&nbsp;</td>' +
        '			<td class="dir-ts-walk">' +
        '				<span class="dir-ts-addinfo dir-ts-addinfopad">' +
        '					Khoảng ' + TSC.roundDistance(ds) + ' ~ ' + TSC.roundTime(ts) +
        '				</span>' +
        '			</td>' +
        '		</tr>' +
        '	</tbody>' +
        '</table>';
    var d = TSC.crtEl();
    d.innerHTML = s;
    return d.childNodes[0];
};

/*
<table>
	<tbody>
		<tr>
			<td>
				<div class="dir-ts-icon">
					<div class="trtline" title="Đi bộ">
						<img class="trtline-icon" alt="Đi bộ" src="//maps.gstatic.com/mapfiles/transit/iw2/7/walk.png">
					</div>
				</div>
				<div class="dir-ts-direction">
					<span class="action">Đi bộ tới 1 Trần Phú (Hà Đông)</span>
				</div>
			</td>
		</tr>
		<tr>
			<td class="dir-ts-walk">
				<span class="dir-ts-addinfo dir-ts-addinfopad">
					Khoảng 2 phút (150 m)
				</span>
			</td>
		</tr>
	</tbody>
</table>
*/
RouteUI.prototype.drawDetailWalk = function (st, nm, ds, km) {
    var s = '<table width="100%" style="cursor:pointer;">' +
        '	<tbody>' +
        '		<tr>' +
        '			<td class="dir-ts-empty-top"></td>' +
        '		</tr>';
    if (st === false) {
        s += '		<tr>' +
            '			<td width="20">&nbsp;</td>' +
            '			<td>' +
            '				<b><span>' + nm + '</span></b>' +
            '			</td>' +
            '		</tr>';
    }
    s += '		<tr>' +
        '			<td width="20">&nbsp;</td>' +
        '			<td>' +
        '				<div class="dir-ts-icon">' +
        '					<div class="ui-route-result-item-title-line" title="Di chuyển">' +
        '						<img class="ui-route-result-item-title-line-icon" alt="Di chuyển" src="' + TSC.url + 'images/route/walk.png">' +
        '					</div>' +
        '				</div>' +
        '				<div class="dir-ts-direction">' +
        '					<span class="action">Di chuyển tới ' + (st ? nm : ds) + '</span>' +
        '				</div>' +
        '			</td>' +
        '		</tr>' +
        '		<tr>' +
        '			<td width="20">&nbsp;</td>' +
        '			<td class="dir-ts-walk">' +
        '				<span class="dir-ts-addinfo dir-ts-addinfopad">' +
        '					Khoảng ' + TSC.roundDistance(km) +
        '				</span>' +
        '			</td>' +
        '		</tr>' +
        '	</tbody>' +
        '</table>';
    var d = TSC.crtEl();
    d.innerHTML = s;
    return d.childNodes[0];
};

//*class SearchUI: class quản lý các thanh điều khiển tìm kiếm và hàm tìm kiếm trên trang chủ!
function SearchUI() {
    this.sts = false;
    this.dom = null;
    this.opt = {};
    this.vehoverstt = {};
    this.station = [];
    this.fltdtl = { tab: null };

    //this.initVehicleOverStation();

    //this.fleetDetail(1);

    this.searchFullInit(true);
};

SearchUI.prototype.searchFullInit = function () {
    if (this.dom == null) {
        this.option = {};
        this.option.bound = TSC.getEl('lft-sr-rlt-opt');
        this.option.bound.style.width = (TSC.UI.size.lpn.w + 0) + 'px';
        this.option.text = TSC.getEl('center-left-search-result-title-text');
        this.option.image = TSC.getEl('center-left-search-result-title-image');
        this.option.image.scope = this;
        this.option.image.onclick = this.clickSearchResultClear;

        this.bound = TSC.getEl('lft-sr-rlt-bnd');
        this.bound.style.width = (TSC.UI.size.lpn.w + 0) + 'px';
        this.bound.style.height = (TSC.UI.size.cen.h - TSC.UI.size.lpn.hdr.h - TSC.UI.size.lpn.ftr.h - 56 - 190) + 'px';

        this.dom = TSC.getEl('lft-sr-rlt-cnt');
        this.dom.style.width = (TSC.UI.size.lpn.w - 22) + 'px';
    } else {
        while (this.dom.childNodes.length > 0)
            this.dom.removeChild(this.dom.childNodes[0]);
    }
    if (arguments.length === 0)
        this.searchResultClear();
};

SearchUI.prototype.clickSearchResultClear = function () {
    this.scope.sts = false;
    this.scope.searchResultClear();
    TSC.switchMenuOpt(1);
};

SearchUI.prototype.searchResultClear = function () {
    try {
        if (this.option.bound)
            this.option.bound.style.display = 'none';
        if (this.dom) {
            while (this.dom.childNodes.length > 0)
                this.dom.removeChild(this.dom.childNodes[0]);
        }

        this.fleetDetailClear();

        for (var i = 0; i < this.station.length; i++)
            this.station[i].Marker.setMap(null);
        this.station = [];
    } catch (ex) { alert(ex) }
};

SearchUI.prototype.searchAroundRequest = function (geo, typ, dis) {
    if (!this.Map)
        this.Map = TSC.Mp.Map;
    this.sts = true;
    TSC.UI.switchMenuOpt(2);
    this.opt = { key: 'Quanh điểm <strong>(' + geo.lng().toFixed(4) + ',' + geo.lat().toFixed(4) + ')</strong>', geo: geo, typ: typ, dis: dis };
    this.searchFullInit();
    $.ajax({
        url: "Engine/Business/Search/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'searcharound',
            lng: geo.lng(),
            lat: geo.lat(),
            typ: typ,
            dis: dis
        },
        success: function (res) {
            if (res.st === true) {
                TSC.Sr.searchFullRender(res.dt.Data);
            } else
                TSC.Sr.searchFullRender([]);
        },
        error: function () {
            //alert( "AJAX - error()" );
        }
    });
};

SearchUI.prototype.searchFullRequest = function (typ, key) {
    if (!this.Map)
        this.Map = TSC.Mp.Map;
    this.sts = true;
    if (!TSC.UI.switchMenuOpt(2)) {
        TSC.UI.items.lft.app.bnd.style.display = 'none';
        TSC.UI.items.lft.adv.bnd.style.position = 'absolute';
        TSC.UI.items.lft.adv.bnd.style.visibility = 'hidden';
        this.option.bound.style.display = '';
        this.bound.style.display = '';
    }
    var keyword = key;
    this.opt = { typ: typ, key: '<strong>' + key + '</strong>' };
    if (typ === "1")
        this.opt.key = 'Tuyến buýt: ' + this.opt.key;
    else if (typ === "2")
        this.opt.key = 'Điểm dừng: ' + this.opt.key;
    else if (typ === "3") {
        this.opt.key = 'Điểm bán vé: ' + this.opt.key;
    }
    else if (typ === "4")
        this.opt.key = 'Điểm trông xe: ' + this.opt.key;
    else if (typ === "5")
        this.opt.key = 'Điểm dịch vụ: ' + this.opt.key;

    this.searchFullInit();

    $.ajax({
        url: "Engine/Business/Search/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'searchfull',
            typ: typ,
            key: keyword
        },
        success: function (res) {
            if (res.st) {
                //eval('res.dt=' + TSC.Bs.decode(cdt(res.dt)) + ';');
                TSC.Sr.searchFullRender(res.dt.Data);
            } else
                TSC.Sr.searchFullRender([]);
        },
        error: function () {
            //alert( "AJAX - error()" );
        }
    });
};

SearchUI.prototype.searchFullRender = function (dts) {
    if (dts != null && dts.length > 0)
        dts = dts.sort(TSC.compareDistance);
    else this.opt.key = this.opt.key + ' không có dữ liệu!';
    this.sts = true;
    this.option.bound.style.display = '';
    this.option.text.innerHTML = this.opt.key;
    var tbd = TSC.crtEl('table', 'ui-route-result-item-start-end list-resust-search li');
    var bdy = TSC.crtEl('tbody', '');


    if (dts != null && dts.length > 0) {
        for (var i = 0; i < dts.length; i++) {
            bdy.appendChild(this.searchFullItem(dts[i]));
        }
    }

    tbd.appendChild(bdy);

    this.dom.appendChild(tbd);

    var bs = TSC.getObjectSize(this.bound);
    var ds = TSC.getObjectSize(this.dom);

    if (ds.h > bs.h) {
        this.bound.style.overflowY = 'scroll';
        this.dom.style.width = (TSC.UI.views.left - 32) + 'px';
    } else {
        this.bound.style.overflowY = 'hidden';
        this.dom.style.width = (TSC.UI.views.left - 22) + 'px';
    }

    if (dts != null && dts.length === 1) {
        if (dts[0].ObjectType === 1)
            this.searchFullClickProcess(dts[0]);
        else
            this.Map.setCenter(new window.google.maps.LatLng(dts[0].Geo.Lat, dts[0].Geo.Lng));
    }
};

SearchUI.prototype.searchFullSort = function (dts) {
    for (var i = 0; i < dts.length - 1; i++) {
        for (var j = i + 1; j < dts.length; j++) {
            if (dts[j].Distance < dts[i].Distance) {
                var tmp = dts[i];
                dts[i] = dts[j];
                dts[j] = tmp;
            }
        }
    }
};

SearchUI.prototype.searchFullItem = function (itm) {
    var trb = TSC.crtEl('tr', '');
    //var tdi = TSC.crtEl('td', '');
    var tdt = TSC.crtEl('td', '');

    if (itm.ObjectType === 1) {
        tdt.innerHTML = '<span class="icon"><img src="images/ui/icon-localtion.png"></span>' +
            '<div class="result-search"><a href="#">' + itm.Name + '</a>' +
            '<div class="ui-sr-itm-data clr-99">' + itm.Data + '</div></div>';
    } else if (itm.ObjectType === 2) {
        tdt.innerHTML = '<span class="icon"><img src="images/ui/icon-localtion.png"></span>' +
            '<div class="result-search"><a href="#">' + itm.Name + '</a>' +
            '<div class="clr-99">' + (itm.Street != null ? itm.Street : '&nbsp;') + '</div></div>';

        this.initStationResultItem(itm);
    } else if (itm.ObjectType === 3) {
        tdt.innerHTML = '<span class="icon"><img src="' + this.getImageUrl('icon', itm) + '"></span>' +
            '<div class="result-search"><a href="#">' + itm.Name + '</a>' +
            '<div class="clr-99">' + (itm.Address != null ? itm.Address : '&nbsp;') + '</div></div>';

        this.initStationResultItem(itm);
    } else if (itm.ObjectType === 4) {
        tdt.innerHTML = '<span class="icon"><img src="' + this.getImageUrl('icon', itm) + '"></span>' +
            '<div class="result-search"><a href="#">' + itm.Address + '</a>' +
            '<div class="clr-99">' + (itm.Organism != null ? itm.Organism : '&nbsp;') + '</div></div>';

        this.initStationResultItem(itm);
    } else if (itm.ObjectType === 5) {
        tdt.innerHTML = '<span class="icon"><img src="' + this.getImageUrl('icon', itm) + '"></span>' +
            '<div class="result-search"><a href="#">' + itm.Name + '</a>' +
            '<div class="clr-99">' + (itm.Address != null ? itm.Address : '&nbsp;') + '</div></div>';

        this.initStationResultItem(itm);
    }
    //trb.appendChild(tdi);
    trb.appendChild(tdt);
    trb.dts = itm;
    trb.onclick = this.searchFullClick;

    return trb;
};

function cdt(dt) {
    try {
        var rs = '';
        for (var i = 0; i < dt.length; i++) {
            dx = zm.indexOf(dt[i]);
            if (dx > -1)
                rs += zn[dx];
            else
                rs += dt[i];
        }
        return rs;
    } catch (ex) { return '' }
};

SearchUI.prototype.searchFullClick = function () {
    /*
	if(this.dts.ObjectType == 1)
		TSC.Sr.fleetDetail(this.dts.ObjectID);
	else if(this.dts.ObjectType == 2 || this.dts.ObjectType == 3 || this.dts.ObjectType == 4 || this.dts.ObjectType == 5)
		TSC.Sr.searchPointDetail(this.dts.ObjectID);
	*/
    TSC.Sr.searchFullClickProcess(this.dts);
};

SearchUI.prototype.searchFullClickProcess = function (dts) {
    if (dts.ObjectType == 1)
        this.fleetDetail(dts.ObjectID);
    else if (dts.ObjectType == 2 || dts.ObjectType == 3 || dts.ObjectType == 4 || dts.ObjectType == 5)
        this.searchPointDetail(dts.ObjectID);
};

SearchUI.prototype.getImageUrl = function (pre, itm) {
    if (itm.ObjectType == 3)
        return 'images/search/' + pre + '/diem-ban-ve.png';
    else if (itm.ObjectType == 4)
        return 'images/search/' + pre + '/diem-do-xe.png';
    else if (itm.KindID == 1)
        return 'images/search/' + pre + '/cho.png';
    else if (itm.KindID == 2)
        return 'images/search/' + pre + '/khach-san.png';
    else if (itm.KindID == 3)
        return 'images/search/' + pre + '/khu-do-thi.png';
    else if (itm.KindID == 4)
        return 'images/search/' + pre + '/co-quan-hanh-chinh.png';
    else if (itm.KindID == 7)
        return 'images/search/' + pre + '/khu-cong-nghiep.png';
    else if (itm.KindID == 8)
        return 'images/search/' + pre + '/truong-hoc.png';
    else if (itm.KindID == 15)
        return 'images/search/' + pre + '/benh-vien.png';
    else if (itm.KindID == 17)
        return 'images/search/' + pre + '/truong-hoc.png';
    else if (itm.KindID == 18)
        return 'images/search/' + pre + '/cong-vien.png';
    else if (itm.KindID == 19)
        return 'images/search/' + pre + '/khu-nghi-duong.png';
    else if (itm.KindID == 20)
        return 'images/search/' + pre + '/dinh-chua.png';
    else if (itm.KindID == 22)
        return 'images/search/' + pre + '/bao-tang.png';
    else if (itm.KindID == 24)
        return 'images/search/' + pre + '/trung-tam-thuong-mai.png';
    else if (itm.KindID == 25)
        return 'images/search/' + pre + '/ben-xe.png';
    else if (itm.KindID == 29)
        return 'images/search/' + pre + '/Cau.png';
    else if (itm.KindID == 31)
        return 'images/search/' + pre + '/khu-giai-tri.png';
    else if (itm.KindID == 32)
        return 'images/search/' + pre + '/khu-di-tich.png';
    else
        return 'images/search/' + pre + '/mac-dinh.png';
};

SearchUI.prototype.initStationResultItem = function (itm) {
    var opt = {
        position: new window.google.maps.LatLng(itm.Geo.Lat, itm.Geo.Lng),
        title: itm.Name,
        map: this.Map
    };

    if (itm.ObjectType === 2) {
        opt.icon = {
            size: new window.google.maps.Size(31, 28),
            anchor: new window.google.maps.Point(0, 28),
            url: 'images/route/map-icon-buyt.png'
        };
    } else if (itm.ObjectType === 3 || itm.ObjectType === 4 || itm.ObjectType === 5) {
        opt.icon = {
            size: new window.google.maps.Size(24, 32),
            anchor: new window.google.maps.Point(12, 32),
            url: this.getImageUrl('map', itm)
        };
    }

    this.station.push({
        ObjectID: itm.ObjectID,
        Marker: new window.google.maps.Marker(opt)
    });

    this.station[this.station.length - 1].Marker._dt = itm;

    window.google.maps.event.addListener(this.station[this.station.length - 1].Marker, 'click', function (evt) {
        var con = '';
        if (this._dt.ObjectType === 2) {
            con = '<div class="sr-info-win-station-title">Điểm dừng: ' + this._dt.Name + '</div>';
            if (this._dt.Street != null && this._dt.Street.length > 0)
                con += '<div class="sr-info-win-station-content">Đường phố: ' + this._dt.Street + '</div>';


            con += '<div class="sr-info-win-station-content">Tuyến đi qua: ' + this._dt.FleetOver + '</div>';

            con += '<div class="sr-info-win-station-content">Tên âm thanh: ' + this._dt.PrivateName + '</div>';
        } else if (this._dt.ObjectType === 3) {
            con = '<div class="sr-info-win-station-title">Điểm bán vé: ' + this._dt.Name + '</div>';
            if (this._dt.Hotline != null && this._dt.Hotline.length > 0)
                con += '<div class="sr-info-win-station-content">Đường dây nóng: ' + this._dt.Hotline + '</div>';
            if (this._dt.Organism != null && this._dt.Organism.length > 0)
                con += '<div class="sr-info-win-station-content">Cơ quan quản lý: ' + this._dt.Organism + '</div>';
            if (this._dt.Address != null && this._dt.Address.length > 0)
                con += '<div class="sr-info-win-station-content">Địa chỉ: ' + this._dt.Address + '</div>';
            if (this._dt.Content != null && this._dt.Content.length > 0)
                con += '<div class="sr-info-win-station-content">Thông tin thêm: ' + this._dt.Content + '</div>';
            con += '<div class="sr-info-win-station-content">Chính sách vé: <a href="http://chinhsachve.transerco.vn" target="_blank">Tham khảo chi tiết tại...</a></div>';
        } else if (this._dt.ObjectType === 4) {
            con = '<div class="sr-info-win-station-title">Điểm trông xe: ' + this._dt.Address + '</div>';
            if (this._dt.Hotline != null && this._dt.Hotline.length > 0)
                con += '<div class="sr-info-win-station-content">Đường dây nóng: ' + this._dt.Hotline + '</div>';
            if (this._dt.Organism != null && this._dt.Organism.length > 0)
                con += '<div class="sr-info-win-station-content">Cơ quan quản lý: ' + this._dt.Organism + '</div>';
            if (this._dt.Kind != null && this._dt.Kind.length > 0)
                con += '<div class="sr-info-win-station-content">Loại hình: ' + this._dt.Kind + '</div>';
            if (this._dt.Capacity != null && this._dt.Capacity.length > 0)
                con += '<div class="sr-info-win-station-content">Sức chứa: ' + this._dt.Capacity + '</div>';
            if (this._dt.Info != null && this._dt.Info.length > 0)
                con += '<div class="sr-info-win-station-content">Thông tin thêm: ' + this._dt.Info + '</div>';
            //if(this._dt.Content != null && this._dt.Content.length > 0)
            con += '<div class="sr-info-win-station-content">Giá vé, dịch vụ: <a href="http://www.timbus.vn/tailieu/69HN.pdf" target="_blank">Tham khảo quyết định 69/2014/QĐ-UBND</a></div>';
        } else if (this._dt.ObjectType == 5) {
            con = '<div class="sr-info-win-station-title">' + this._dt.Name + '</div>';
            if (this._dt.Hotline != null && this._dt.Hotline.length > 0)
                con += '<div class="sr-info-win-station-content">Đường dây nóng: ' + this._dt.Hotline + '</div>';
            if (this._dt.Organism != null && this._dt.Organism.length > 0)
                con += '<div class="sr-info-win-station-content">Cơ quan quản lý: ' + this._dt.Organism + '</div>';
            if (this._dt.Address != null && this._dt.Address.length > 0)
                con += '<div class="sr-info-win-station-content">Địa chỉ: ' + this._dt.Address + '</div>';
            if (this._dt.Kind != null && this._dt.Kind.length > 0)
                con += '<div class="sr-info-win-station-content">Loại hình: ' + this._dt.Kind + '</div>';
            if (this._dt.Content != null && this._dt.Content.length > 0)
                con += '<div class="sr-info-win-station-content">Thông tin thêm: ' + this._dt.Content + '</div>';
        }

        TSC.Mp.rt.wi.setContent(TSC.renderInfoWindowContent(this._dt.ObjectType, con, this._dt));
        TSC.Mp.rt.wi.open(TSC.Sr.Map, this);
    });
};

SearchUI.prototype.searchPointDetail = function (oid) {
    for (var i = 0; i < this.station.length; i++) {
        if (this.station[i].ObjectID == oid) {
            google.maps.event.trigger(this.station[i].Marker, 'click', []);
            return;
        }
    }
};

SearchUI.prototype.vehicleOverStationRequest = function (dt) {
    this.vehicleOverStationInit(dt);
    if (TSC.Sr.vehoverstt.timer.tm.isActive)
        TSC.Sr.vehoverstt.timer.tm.stop();
    TSC.Sr.vehoverstt.timer.st = true;
    TSC.Sr.vehoverstt.timer.tm.once(0);
};

SearchUI.prototype.vehicleOverStationInit = function (dt) {
    if (!this.vehoverstt.ui) {
        this.vehoverstt.ui = { items: {}, fltchk: [] };

        if (!this.Map)
            this.Map = TSC.Mp.Map;

        this.vehoverstt.ui.close = TSC.crtEl('img', 'search-station-vehicle-over-close');
        this.vehoverstt.ui.close.scope = this;
        this.vehoverstt.ui.close.onclick = this.vehicleOverStationClickClose;

        this.vehoverstt.ui.title = TSC.crtEl('div', 'search-station-vehicle-over-title');
        this.vehoverstt.ui.title.innerHTML = 'Xe sắp tới điểm dừng: <span style="font-weight:bold;">' + dt.Name + '</span>';

        this.vehoverstt.ui.fleet = TSC.crtEl('div', 'search-station-vehicle-over-fleet');

        this.vehoverstt.ui.content = TSC.crtEl('div', 'search-station-vehicle-over-content');

        this.vehoverstt.ui.bound = TSC.crtEl('div');
        this.vehoverstt.ui.bound.className = 'search-station-vehicle-over-bound';

        this.vehoverstt.ui.bound.appendChild(this.vehoverstt.ui.close);
        this.vehoverstt.ui.bound.appendChild(this.vehoverstt.ui.title);
        this.vehoverstt.ui.bound.appendChild(this.vehoverstt.ui.fleet);
        this.vehoverstt.ui.bound.appendChild(this.vehoverstt.ui.content);

        this.Map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.vehoverstt.ui.bound);

        this.vehoverstt.timer = {
            dt: dt,
            tm: $.timer(this.vehicleOverStationTimer, 5000)
        };
    } else {
        this.vehoverstt.timer.dt = dt;
        this.vehoverstt.ui.bound.style.display = '';
        this.vehoverstt.ui.title.innerHTML = 'Xe sắp tới điểm dừng: <span style="font-weight:bold;">' + dt.Name + '</span>'
    }

    this.vehicleOverStationInitFleet(dt.FleetOver.split(','), dt.FleetList ? dt.FleetList.split(',') : null);
};

SearchUI.prototype.vehicleOverStationInitFleet = function (fov, fls) {
    while (this.vehoverstt.ui.fleet.childNodes.length > 0)
        this.vehoverstt.ui.fleet.removeChild(this.vehoverstt.ui.fleet.childNodes[0]);
    this.vehoverstt.ui.fltchk = [];

    var tbl = TSC.crtEl('table', 'sr-vos-fleet-table');
    var tbb = TSC.crtEl('tbody', '');
    var trb = TSC.crtEl('tr', '');
    var tdt = TSC.crtEl('td', 'sr-vos-fleet-text');
    tbl.cellPadding = 0;
    tbl.cellSpacing = 0;
    tbl.appendChild(tbb);
    trb.appendChild(tdt);
    tdt.innerHTML = 'Tuyến:';
    for (var i = 0; i < fov.length; i++) {
        var tdc = TSC.crtEl('td', 'sr-vos-fleet-checkbox');
        var tdf = TSC.crtEl('td', 'sr-vos-fleet-fleetcode');
        var chk = TSC.crtEl('input');
        chk._dt = fov[i];
        chk.type = 'checkbox';
        chk.checked = fls == null || fls.indexOf(fov[i]) > -1;

        tdc.appendChild(chk);
        tdf.innerHTML = fov[i];

        trb.appendChild(tdc);
        trb.appendChild(tdf);

        this.vehoverstt.ui.fltchk.push(chk);
    }
    trb.appendChild(TSC.crtEl('td'));
    tbb.appendChild(trb);
    this.vehoverstt.ui.fleet.appendChild(tbl);
};

SearchUI.prototype.vehicleOverStationFleetOver = function () {
    var sts = false;
    var flt = '';
    for (var i = 0; i < this.vehoverstt.ui.fltchk.length; i++) {
        if (this.vehoverstt.ui.fltchk[i].checked == true) {
            if (flt.length > 0)
                flt += ',';
            flt += this.vehoverstt.ui.fltchk[i]._dt;
        } else {
            sts = true;
        }
    }
    if (flt.length > 0 && sts == false)
        return '';
    else
        return flt;
};

SearchUI.prototype.vehicleOverStationClickClose = function () {
    this.scope.vehoverstt.ui.bound.style.display = 'none';
    TSC.Sr.vehoverstt.timer.tm.stop();
};

SearchUI.prototype.vehicleOverStationTimer = function () {
    TSC.Sr.vehoverstt.timer.tm.stop();
    $.ajax({
        url: "Engine/Business/Vehicle/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'partremained',
            State: TSC.Sr.vehoverstt.timer.st,
            StationID: TSC.Sr.vehoverstt.timer.dt.ObjectID,
            FleetOver: TSC.Sr.vehicleOverStationFleetOver()
        },
        success: function (res) {
            if (res.st === true) {
                //eval('res.dt=' + TSC.Bs.decode(cdt(res.dt)) + ';');
                TSC.Sr.vehicleOverStationRenderResult(res.dt.sort(TSC.Sr.compare));
            } else {
                TSC.Sr.vehicleOverStationRenderResult([]);
            }
            TSC.Sr.vehoverstt.timer.tm.play(true);
        },
        error: function () {
            //alert( "AJAX - error()" );
        }
    });
    TSC.Sr.vehoverstt.timer.st = false;
};

SearchUI.prototype.compare = function (aa, bb) {
    // So sánh theo PrivateCode (trả về Json tên thuộc tính là P41
    var a = aa["Fleet"];
    var b = bb["Fleet"];
    if ($.isNumeric(a) && $.isNumeric(b)) {
        if (parseInt(a) > parseInt(b)) return 1;
        if (parseInt(a) < parseInt(b)) return -1;
        if (parseInt(a) > parseInt(b)) return 0;
    }
    if ($.isNumeric(a) && !$.isNumeric(b))
        return -1;
    if (!$.isNumeric(a) && $.isNumeric(b))
        return 1;
    return a.toLowerCase().localeCompare(b.toLowerCase());
}

SearchUI.prototype.vehicleOverStationRenderResult = function (dt) {
    while (this.vehoverstt.ui.content.childNodes.length > 0)
        this.vehoverstt.ui.content.removeChild(this.vehoverstt.ui.content.childNodes[0]);
    if (dt.length == 0)
        return;
    var tbl = TSC.crtEl('table', 'sr-vehicle-over-station-table');
    var tblhead = TSC.crtEl('thead', '');
    var tblheader = TSC.crtEl('tr', '');
    var thxe = TSC.crtEl('th', '');
    thxe.innerHTML = "Xe";
    var thtuyen = TSC.crtEl('th', '');
    thtuyen.innerHTML = "Tuyến";
    var thkm = TSC.crtEl('th', '');
    thkm.innerHTML = "Khoảng cách";
    var thtime = TSC.crtEl('th', '');
    thtime.innerHTML = "Thời gian";

    tblheader.appendChild(thtuyen);
    tblheader.appendChild(thxe);
    tblheader.appendChild(thkm);
    tblheader.appendChild(thtime);

    tblhead.appendChild(tblheader);

    tbl.appendChild(tblhead);
    var tbb = TSC.crtEl('tbody', '');
    tbl.cellPadding = 0;
    tbl.cellSpacing = 0;
    tbl.appendChild(tbb);

    for (var i = 0; i < dt.length; i++) {
        var trb = TSC.crtEl('tr', '');
        var tdb = TSC.crtEl('td', '');
        var tdf = TSC.crtEl('td', '');
        var tdd = TSC.crtEl('td', 'center-follow');
        var tdt = TSC.crtEl('td', '');
        tdb.innerHTML = dt[i].BienKiemSoat;
        tdf.innerHTML = dt[i].FleetCode;
        tdd.innerHTML = TSC.roundDistance(dt[i].PartRemained);
        tdt.innerHTML = TSC.roundTime(dt[i].TimeRemained);

        trb.appendChild(tdf);
        trb.appendChild(tdb);
        trb.appendChild(tdd);
        trb.appendChild(tdt);

        tbb.appendChild(trb);
    }
    var trt = TSC.crtEl('tr', '');
    var tdt = TSC.crtEl('td', 'sr-vehicle-over-station-time');
    tdt.colSpan = 4;
    tdt.innerHTML = 'Thời điểm cập nhật: <span style="font-weight:bold;">' + TSC.renderDateTime(new Date()) + '</span>';
    trt.appendChild(tdt);
    tbb.appendChild(trt);
    this.vehoverstt.ui.content.appendChild(tbl);
};

SearchUI.prototype.fleetDetailInit = function () {
    console.log('Go to fleetDetailInit! ');
    this.fltdtl = { ui: {}, go: { st: [] }, re: { st: [] } };

    this.fltdtl.ui.close = TSC.crtEl('img', 'search-fleet-detail-close');
    this.fltdtl.ui.close.scope = this;
    this.fltdtl.ui.close.onclick = this.fleetRouteClickClose;

    this.fltdtl.ui.title = TSC.crtEl('div', 'search-fleet-detail-title');
    this.fltdtl.ui.title.innerHTML = 'Tuyến: ';

    this.fltdtl.ui.info = TSC.getEl('search-fleet-detail-fr');
    this.fltdtl.ui.trago = TSC.getEl('search-fleet-detail-go');
    this.fltdtl.ui.trare = TSC.getEl('search-fleet-detail-re');

    TSC.getEl('search-fleet-detail-tab-fr').onclick = this.fleetDetailTabClick;
    TSC.getEl('search-fleet-detail-tab-go').onclick = this.fleetDetailTabClick;
    TSC.getEl('search-fleet-detail-tab-re').onclick = this.fleetDetailTabClick;

    this.fltdtl.ui.bound = TSC.crtEl('div');
    this.fltdtl.ui.bound.className = 'search-fleet-detail-bound';

    var c = TSC.getEl('search-fleet-detail');
    c.style.display = '';

    this.fltdtl.ui.bound.appendChild(this.fltdtl.ui.close);
    this.fltdtl.ui.bound.appendChild(this.fltdtl.ui.title);
    this.fltdtl.ui.bound.appendChild(c);

    this.Map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(this.fltdtl.ui.bound);
};

SearchUI.prototype.fleetRouteClickClose = function () {
    this.scope.fleetRouteShowHide(false);
};

SearchUI.prototype.fleetRouteShowHide = function (st) {
    this.fltdtl.ui.bound.style.display = st === true ? '' : 'none';
    if (st === false)
        this.fleetDetailClear();
};

SearchUI.prototype.fleetDetailClear = function () {
    if (this.fltdtl && this.fltdtl.ui && this.fltdtl.ui.bound)
        this.fltdtl.ui.bound.style.display = 'none';

    if (!this.fltdtl || !this.fltdtl.go || !this.fltdtl.re)
        return;

    if (this.fltdtl.go.pl)
        this.fltdtl.go.pl.setMap(null);
    for (var i = 0; i < this.fltdtl.go.st.length; i++)
        this.fltdtl.go.st[i].setMap(null);
    this.fltdtl.go.st = [];

    if (this.fltdtl.re.pl)
        this.fltdtl.re.pl.setMap(null);
    for (var i = 0; i < this.fltdtl.re.st.length; i++)
        this.fltdtl.re.st[i].setMap(null);
    this.fltdtl.re.st = [];
};

SearchUI.prototype.fleetDetailTabClick = function () {
    if (this.id.indexOf('tab-fr') > 0)
        TSC.Sr.fleetDetailTabSwitch.apply(TSC.Sr, [1]);
    else if (this.id.indexOf('tab-go') > 0)
        TSC.Sr.fleetDetailTabSwitch.apply(TSC.Sr, [2]);
    else if (this.id.indexOf('tab-re') > 0)
        TSC.Sr.fleetDetailTabSwitch.apply(TSC.Sr, [3]);
};

SearchUI.prototype.fleetDetailTabSwitch = function (tp) {
    if (this.fltdtl.tab === tp)
        return;
    this.fltdtl.tab = tp;
    if (tp === 1) {
        TSC.getEl('search-fleet-detail-tab-fr').className = 'search-fleet-detail-tab-title-focus';
        TSC.getEl('search-fleet-detail-tab-go').className = 'search-fleet-detail-tab-title-none';
        TSC.getEl('search-fleet-detail-tab-re').className = 'search-fleet-detail-tab-title-none';

        this.fltdtl.ui.info.style.display = '';
        this.fltdtl.ui.trago.style.display = 'none';
        this.fltdtl.ui.trare.style.display = 'none';

        if (this.fltdtl.go.pl)
            this.fltdtl.go.pl.setMap(this.Map);
        for (var i = 0; i < this.fltdtl.go.st.length; i++)
            this.fltdtl.go.st[i].setMap(this.Map);

        if (this.fltdtl.re.pl)
            this.fltdtl.re.pl.setMap(this.Map);
        for (var i = 0; i < this.fltdtl.re.st.length; i++)
            this.fltdtl.re.st[i].setMap(this.Map);
    } else if (tp == 2) {
        TSC.getEl('search-fleet-detail-tab-fr').className = 'search-fleet-detail-tab-title-none';
        TSC.getEl('search-fleet-detail-tab-go').className = 'search-fleet-detail-tab-title-focus';
        TSC.getEl('search-fleet-detail-tab-re').className = 'search-fleet-detail-tab-title-none';

        this.fltdtl.ui.info.style.display = 'none';
        this.fltdtl.ui.trago.style.display = '';
        this.fltdtl.ui.trare.style.display = 'none';

        if (this.fltdtl.go.pl)
            this.fltdtl.go.pl.setMap(this.Map);
        for (var i = 0; i < this.fltdtl.go.st.length; i++)
            this.fltdtl.go.st[i].setMap(this.Map);

        if (this.fltdtl.re.pl)
            this.fltdtl.re.pl.setMap(null);
        for (var i = 0; i < this.fltdtl.re.st.length; i++)
            this.fltdtl.re.st[i].setMap(null);
    } else if (tp == 3) {
        TSC.getEl('search-fleet-detail-tab-fr').className = 'search-fleet-detail-tab-title-none';
        TSC.getEl('search-fleet-detail-tab-go').className = 'search-fleet-detail-tab-title-none';
        TSC.getEl('search-fleet-detail-tab-re').className = 'search-fleet-detail-tab-title-focus';

        this.fltdtl.ui.info.style.display = 'none';
        this.fltdtl.ui.trago.style.display = 'none';
        this.fltdtl.ui.trare.style.display = '';

        if (this.fltdtl.go.pl)
            this.fltdtl.go.pl.setMap(null);
        for (var i = 0; i < this.fltdtl.go.st.length; i++)
            this.fltdtl.go.st[i].setMap(null);

        if (this.fltdtl.re.pl)
            this.fltdtl.re.pl.setMap(this.Map);
        for (var i = 0; i < this.fltdtl.re.st.length; i++)
            this.fltdtl.re.st[i].setMap(this.Map);
    }
};

SearchUI.prototype.fleetDetailFill = function (dt) {
    if (!this.fltdtl.ui) {
        this.fleetDetailInit();
    } else {
        this.fleetRouteShowHide(true);
    }

    this.fleetDetailClear();

    var isWeekend = false;
    if (TSC.fleetCodeWeekend.indexOf(dt.Code) >= 0) {
        isWeekend = true;
    }

    this.fltdtl.ui.bound.style.display = '';
    this.fltdtl.ui.title.innerHTML = 'Tuyến ' + dt.Code + ': ' + dt.Name;
    this.fltdtl.ui.trago.innerHTML = (dt.Go.Anomaly > 0 ? '<div><span class="search-fleet-detail-info-header">Cự ly: </span><span class="search-fleet-detail-trajection-content">' + (dt.Go.Anomaly / 1000).toFixed(1) + ' (km)</span></div>' : '') +
        '<div><span class="search-fleet-detail-info-header">Chi tiết: </span><span class="search-fleet-detail-trajection-content">' + dt.Go.Route + '</span></div>';
    this.fltdtl.ui.trare.innerHTML = (dt.Re.Anomaly > 0 ? '<div><span class="search-fleet-detail-info-header">Cự ly: </span><span class="search-fleet-detail-trajection-content">' + (dt.Re.Anomaly / 1000).toFixed(1) + ' (km)</span></div>' : '') +
        '<div><span class="search-fleet-detail-info-header">Chi tiết: </span><span class="search-fleet-detail-trajection-content">' + dt.Re.Route + '</span></div>';
    //*sign Giao diện cũ chưa có lịch trình theo từng ngày
    //this.fltdtl.ui.info.innerHTML = '<div><span class="search-fleet-detail-info-header">Mã tuyến: </span><span class="search-fleet-detail-info-content">' + dt.Code + (isWeekend ?  ' <i style="color:red;">(Chạy từ tối T6 đến hết CN)</i>' : '') + '</span></div>' +
    //								'<div><span class="search-fleet-detail-info-header">Xí nghiệp: </span><span class="search-fleet-detail-info-content">' + dt.Enterprise + '</span></div>' +
    //								'<div><span class="search-fleet-detail-info-header">Tên tuyến: </span><span class="search-fleet-detail-info-content">' + dt.Name + '</span></div>' +
    //								(dt.BusCount.length > 0 ? '<div><span class="search-fleet-detail-info-header">Số xe vận hành: </span><span class="search-fleet-detail-info-content">' + dt.BusCount + '</span></div>' : '') +
    //								'<div><span class="search-fleet-detail-info-header">Thời gian xuất/đến bến: </span><span class="search-fleet-detail-info-content">' + dt.OperationsTime + '</span></div>' +
    //								'<div><span class="search-fleet-detail-info-header">Tần suất hoạt động: </span><span class="search-fleet-detail-info-content">' + dt.Frequency + '</span></div>' +
    //								'<div><span class="search-fleet-detail-info-header">Giá vé: </span><span class="search-fleet-detail-info-content">' + dt.Cost + '</span></div>';
    var thu = '';
    var thoigianGadau = '';
    var thoigianGacuoi = '';
    var arrGaDau, arrGaCuoi;
    var space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    var sp = '&nbsp;&nbsp;&nbsp;&nbsp;';
    var table = '<div><span class="search-fleet-detail-info-header">Thời gian xuất/đến bến: </span><span class="search-fleet-detail-info-content">' + dt.OperationsTime + '</span></div>';
    if (dt.OperationsTime.length > 10) {
        var arrLine = dt.OperationsTime.split('###');
        if (arrLine.length == 2) {
            arrGaDau = arrLine[0].split('|');
            arrGaCuoi = arrLine[1].split('|');
            thu = 'Thời gian xuất/đến bến ' + space + arrGaDau[1] + space + space + sp + sp + arrGaDau[3] + space + space + sp + sp + arrGaDau[5];
            thoigianGadau = dt.FirstStation + space + space + arrGaDau[2].split(';')[0].replace(',', ' - ') + space + arrGaDau[4].split(';')[0].replace(',', ' - ') + space + arrGaDau[6].split(';')[0].replace(',', ' - ');
            thoigianGacuoi = dt.LastStation + space + space + arrGaCuoi[2].split(';')[0].replace(',', ' - ') + space + arrGaCuoi[4].split(';')[0].replace(',', ' - ') + space + arrGaCuoi[6].split(';')[0].replace(',', ' - ');
            table = '<table> ' +
                '<tr style="font-weight:bold;" ><td>Thời gian xuất bến/đến bến</td><td>' + sp + arrGaDau[1] + '</td><td>' + space + arrGaDau[3] + '</td><td>' + space + arrGaDau[5] + '</td></tr>' +
                '<tr><td>' + dt.FirstStation + '</td><td>' + arrGaDau[2].split(';')[0].replace(',', ' - ') + '</td><td>' + arrGaDau[4].split(';')[0].replace(',', ' - ') + '</td><td>' + arrGaDau[6].split(';')[0].replace(',', ' - ') + '</td></tr>' +
                '<tr><td>' + dt.LastStation + '</td><td>' + arrGaCuoi[2].split(';')[0].replace(',', ' - ') + '</td><td>' + arrGaCuoi[4].split(';')[0].replace(',', ' - ') + '</td><td>' + arrGaCuoi[6].split(';')[0].replace(',', ' - ') + '</td></tr>' +
                '</table>';
        }
    }

    this.fltdtl.ui.info.innerHTML = '<div><span class="search-fleet-detail-info-header">Mã tuyến: </span><span class="search-fleet-detail-info-content">' + dt.Code + (isWeekend ? ' <i style="color:red;">(Chạy từ tối T6 đến hết CN)</i>' : '') + '</span></div>' +
        '<div><span class="search-fleet-detail-info-header">Xí nghiệp: </span><span class="search-fleet-detail-info-content">' + dt.Enterprise + '</span></div>' +
        '<div><span class="search-fleet-detail-info-header">Tên tuyến: </span><span class="search-fleet-detail-info-content">' + dt.Name + '</span></div>' +
        (dt.BusCount.length > 0 ? '<div><span class="search-fleet-detail-info-header">Số xe vận hành: </span><span class="search-fleet-detail-info-content">' + dt.BusCount + '</span></div>' : '')
        + table +
        '<div><span class="search-fleet-detail-info-header">Tần suất hoạt động: </span><span class="search-fleet-detail-info-content">' + dt.Frequency + '</span></div>' +
        '<div><span class="search-fleet-detail-info-header">Giá vé: </span><span class="search-fleet-detail-info-content">' + dt.Cost + '</span></div>';

    this.fleetDetailFillRoute(dt);
    this.fleetDetailFillStation(dt);
    this.fleetDetailTabSwitch(1);
};

SearchUI.prototype.fleetDetailFillRoute = function (dt) {
    var ptgo = [];
    var i;
    for (i = 0; i < dt.Go.Geo.length; i++)
        ptgo.push(new window.google.maps.LatLng(dt.Go.Geo[i].Lat, dt.Go.Geo[i].Lng));
    if (this.fltdtl.go.pl) {
        this.fltdtl.go.pl.setOptions({
            path: ptgo,
            map: this.Map
        });
    } else {
        this.fltdtl.go.pl = new window.google.maps.Polyline({
            path: ptgo,
            strokeColor: 'blue',
            strokeOpacity: .4,
            strokeWeight: 4,
            map: this.Map
        });
    }

    var ptre = [];
    for (i = 0; i < dt.Re.Geo.length; i++)
        ptre.push(new window.google.maps.LatLng(dt.Re.Geo[i].Lat, dt.Re.Geo[i].Lng));
    if (this.fltdtl.re.pl) {
        this.fltdtl.re.pl.setOptions({
            path: ptre,
            map: this.Map
        });
    } else {
        this.fltdtl.re.pl = new window.google.maps.Polyline({
            path: ptre,
            strokeColor: 'red',
            strokeOpacity: .4,
            strokeWeight: 4,
            map: this.Map
        });
    }
};

SearchUI.prototype.fleetDetailFillStation = function (dt) {
    var bound = new window.google.maps.LatLngBounds();
    var geo;
    var i;
    for (i = 0; i < dt.Go.Station.length; i++) {
        geo = new window.google.maps.LatLng(dt.Go.Station[i].Geo.Lat, dt.Go.Station[i].Geo.Lng);
        this.fltdtl.go.st.push(new window.google.maps.Marker({
            position: geo,
            icon: {
                size: new window.google.maps.Size(31, 28),
                anchor: new window.google.maps.Point(0, 28),
                url: 'images/search/map-icon-buyt-go.png'
            },
            map: this.Map
        }));

        this.fltdtl.go.st[i]._dt = dt.Go.Station[i];

        window.google.maps.event.addListener(this.fltdtl.go.st[i], 'click', function (evt) {
            var tx = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                '<div class="rt-info-win-start-end-content">' + (this._dt.Name.length > 0 ? this._dt.Name : '&nbsp') + '</div>';
            TSC.Mp.rt.wi.setContent(TSC.renderInfoWindowContent(2, tx, this._dt));
            TSC.Mp.rt.wi.open(TSC.Mp.Map, this);
        });

        bound.extend(geo);
    }

    for (i = 0; i < dt.Re.Station.length; i++) {
        geo = new window.google.maps.LatLng(dt.Re.Station[i].Geo.Lat, dt.Re.Station[i].Geo.Lng);
        this.fltdtl.re.st.push(new window.google.maps.Marker({
            position: new window.google.maps.LatLng(dt.Re.Station[i].Geo.Lat, dt.Re.Station[i].Geo.Lng),
            icon: {
                size: new window.google.maps.Size(31, 28),
                anchor: new window.google.maps.Point(0, 28),
                url: 'images/search/map-icon-buyt-re.png'
            },
            map: this.Map
        }));

        this.fltdtl.re.st[i]._dt = dt.Re.Station[i];

        window.google.maps.event.addListener(this.fltdtl.re.st[i], 'click', function (evt) {
            var tx = '<div class="rt-info-win-start-end-title">Điểm dừng xe buýt</div>' +
                '<div class="rt-info-win-start-end-content">' + (this._dt.Name.length > 0 ? this._dt.Name : '&nbsp') + '</div>';
            TSC.Mp.rt.wi.setContent(TSC.renderInfoWindowContent(2, tx, this._dt));
            TSC.Mp.rt.wi.open(TSC.Mp.Map, this);
        });

        bound.extend(geo);
    }

    this.Map.fitBounds(bound);
};

SearchUI.prototype.fleetDetail = function (fid) {
    //var datetime = new Date();
    $.ajax({
        url: "Engine/Business/Search/action.ashx",
        type: "post",
        dataType: "json",
        data: {
            act: 'fleetdetail',
            fid: fid
        },
        success: function (res) {

            if (res.st) {
                TSC.Sr.fleetDetailFill(res.dt);
            }

            //alert(new Date() - datetime);
            //else {
            //    //alert(dts.dt);
            //}
        },
        error: function () {
            //alert( "AJAX - error()" );
        }
    });
}; function PrintfUI() {

};

PrintfUI.prototype.printfResult = function () {
    var dx = TSC.Rt.index;
    var width = 794;
    var height = 1122;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    var dt = TSC.getEl('tsc-route-result-display-0' + dx + '-detail').innerHTML;
    var wd = window.open('', 'In kết quả', 'height=' + height + ',width=' + width + ', top=' + top + ', left=' + left);
    wd.document.write('<html><head><title>In kết quả</title>');
    wd.document.write('<link rel="stylesheet" href="css/ui.css" type="text/css" />');
    wd.document.write('<link rel="stylesheet" href="css/home.css" type="text/css" />');
    wd.document.write('<link rel="stylesheet" href="css/route.css" type="text/css" />');
    wd.document.write('</head><body >');
    wd.document.write(this.renderMainRegion(dt));
    wd.document.write('</body></html>');
    setTimeout(function () {
        wd.print();
        wd.close();
    }, 100);
    return true;
};

PrintfUI.prototype.renderMainRegion = function (lf) {
    var opt = TSC.getEl('lft-rt-opt-tp');
    var s = '<table width="100%" border="0">' +
        '	<tbody>' +
        '		<tr>' +
        '			<td width="350px;" style="background-color:#FEF5E9;border:solid 1px #FBA80D;padding:3px 0 5px 5px;">' +
        '				<table cellpadding="0" cellspacing="0" width="100%">' +
        '					<tr>' +
        '						<td class="printf-input-lable">Điểm đi:</td>' +
        '						<td class="printf-input-value">' + TSC.getEl('lft-rt-opt-fr').value + '</td>' +
        '					</tr>' +
        '					<tr>' +
        '						<td class="printf-input-lable">Điểm đến:</td>' +
        '						<td class="printf-input-value">' + TSC.getEl('lft-rt-opt-to').value + '</td>' +
        '					</tr>' +
        '					<tr>' +
        '						<td class="printf-input-lable">Tùy chọn:</td>' +
        '						<td class="printf-input-value">' + opt.options[opt.selectedIndex].text + '</td>' +
        '					</tr>' +
        '				</table>' +
        '			</td>' +
        '		</tr>' +
        '		<tr>' +
        '			<td width="350px;">' + lf + '</td>' +
        '		</tr>' +
        '		<tr>' +
        '			<td width="350px;">Để in cả bản đồ, người dùng nhấn tổ hợp phím Ctr + P</td>' +
        '		</tr>' +
        '	<tbody>' +
        '</table>';

    return s;
}; if (typeof (document.attachEvent) != 'undefined') {
    document.attachEvent('onmouseup', BAMenuMouseUp);
} else if (typeof (document.addEventListener) != 'undefined') {
    document.addEventListener('mouseup', BAMenuMouseUp, false);
};

function BAMenuMouseUp() {
    if (!queueManager.sm) {
        if (queueManager.rt)
            queueManager.rt.hide();
    }
    queueManager.sm = false;
};

function BAMenu(o) {
    var ua = navigator.userAgent.toLowerCase();
    this.isFF = (ua.indexOf("mozilla") > -1) && (ua.indexOf("firefox") > -1);
    this.isIE = !this.isOpera && ua.indexOf("msie") > -1;
    this.pr = null;
    this.sc = o.scope;
    this.cf = { fc: o.focusColor || '#c6cfe7', tc: o.textColor || '#000000', hd: o.hideMouseOut || false, it: [], dx: o.index || 1, lv: o.level || 1 };
    this.it = {};

    this.initItems(o);
    this.calSize();
    this.initBound();
    this.drawListMenuItems();
};

BAMenu.prototype.initItems = function (o) {
    for (var i = 0; i < o.items.length; i++) {
        if (typeof (o.items[i]) == 'string')
            this.cf.it[i] = new BAMenuSeparator();
        else
            this.cf.it[i] = new BAMenuItem(o.items[i], this, this.sc, this.cf.fc, this.cf.tc, this.cf.dx, this.cf.lv);
    }
};

BAMenu.prototype.calSize = function () {
    var nLength = 0;
    var nHeight = 0;
    for (var i = 0; i < this.cf.it.length; i++) {
        if (this.cf.it[i].isMenuItem) {
            nLength = Math.max(nLength, this.cf.it[i].text.length);
            nHeight += 25;
        } else {
            nHeight += 6;
        }
    }
    this.size = { w: nLength * 5 + 58, h: nHeight + 2 }
};

BAMenu.prototype.initBound = function () {
    var tl = this.createObject(8, 8, 'x-menu-bound-top-left');
    var tm = this.createObject(this.size.w - 20, 8, 'x-menu-bound-top-midd');
    var tr = this.createObject(12, 8, 'x-menu-bound-top-right');
    var tb = this.createObject(0, 0, 'x-menu-clear');
    var dt = this.createObject(0, 8, 'x-menu-bound-top');

    var cl = this.createObject(2, this.size.h, 'x-menu-bound-content-left');
    this.it.ct = this.createObject(this.size.w - 10, this.size.h, 'x-menu-bound-content-midd');
    var cr = this.createObject(8, this.size.h, 'x-menu-bound-content-right');
    var cb = this.createObject(0, 0, 'x-menu-clear');
    var dc = this.createObject(0, 0, 'x-menu-bound-content');

    var bl = this.createObject(12, 12, 'x-menu-bound-bottom-left');
    var bm = this.createObject(this.size.w - 24, 12, 'x-menu-bound-bottom-midd');
    var br = this.createObject(12, 12, 'x-menu-bound-bottom-right');
    var bb = this.createObject(0, 0, 'x-menu-clear');
    var db = this.createObject(0, 12, 'x-menu-bound-bottom');

    dt.appendChild(tl);
    dt.appendChild(tm);
    dt.appendChild(tr);
    dt.appendChild(tb);

    dc.appendChild(cl);
    dc.appendChild(this.it.ct);
    dc.appendChild(cr);
    dc.appendChild(cb);

    db.appendChild(bl);
    db.appendChild(bm);
    db.appendChild(br);
    db.appendChild(bb);

    this.it.bd = this.createObject(this.size.w, 0, 'x-menu-bound');
    this.it.bd.appendChild(dt);
    this.it.bd.appendChild(dc);
    this.it.bd.appendChild(db);
    this.it.bd.style.zIndex = this.cf.dx;
    this.it.bd.style.display = 'none';
    this.it.bd.oncontextmenu = this.contextMenu;

    document.body.appendChild(this.it.bd);
};

BAMenu.prototype.drawListMenuItems = function () {
    for (var i = 0; i < this.cf.it.length; i++) {
        if (this.cf.it[i].isMenuItem) {
            this.createMenuItem(this.cf.it[i]);
        } else {
            this.createMenuSeparator(this.cf.it[i]);
        }
    }
};

BAMenu.prototype.createMenuItem = function (itm) {
    var il = this.createObject(16, 16, itm.iconCls);
    var im = this.createObject(this.size.w - 40, 16, 'x-menu-items-text');
    var ir = this.createObject(6, 16, itm.sm ? 'x-menu-items-arrow' : 'x-menu-items-icon');
    var ib = this.createObject(0, 0, 'x-menu-clear');
    var de = this.createObject(this.size.w - 10, 25, 'x-menu-items-event');
    var di = this.createObject(0, 20, 'x-menu-items');

    im.innerHTML = itm.text;
    di.mn = this;
    di.im = im;
    itm.di = di;
    di.cf = itm;
    de.di = di;
    de.oncontextmenu = this.contextMenu;
    de.onmouseout = this.menuItemMouseOut;
    de.onmouseover = this.menuItemMouseOver;
    de.onclick = this.menuItemOnClick;

    di.appendChild(il);
    di.appendChild(im);
    di.appendChild(ir);
    di.appendChild(ib);
    di.appendChild(de);

    this.it.ct.appendChild(di);
};

BAMenu.prototype.createMenuSeparator = function () {//i
    var di = this.createObject(this.size.w - 10, 6, 'x-menu-separator');
    di.onmouseout = function () { queueManager.sp = false };
    di.onmouseover = function () { queueManager.sp = true };
    di.onmousedown = function () { queueManager.sm = true };
    this.it.ct.appendChild(di);
};

BAMenu.prototype.menuItemMouseOut = function () {//e
    queueManager.it = this.di;
    queueManager.id = queueManager.qu.enqueue(0, 2000, this.di.mn, this.di.mn.timerMenuItemMouseOut, [0]);
};

BAMenu.prototype.timerMenuItemMouseOut = function () {
    if (!queueManager.it.cf.sm) {
        queueManager.it.style.backgroundColor = '#ffffff';
        queueManager.it.im.style.color = '#000000';
    }
    if (queueManager.rt && queueManager.rt.cf.hd && !queueManager.sp)
        queueManager.rt.hide();
};

BAMenu.prototype.menuItemMouseOver = function () {//e
    queueManager.qu.dequeue(0, queueManager.id);
    var i = 0;
    if (queueManager.it) {
        if (!queueManager.it.cf.sm) {
            queueManager.it.style.backgroundColor = '#ffffff';
            queueManager.it.im.style.color = '#000000';
            if (this.di.mn.cf.lv < queueManager.it.mn.cf.lv) {
                for (i = this.di.mn.cf.lv - 1; i < queueManager.it.mn.cf.lv; i++) {
                    if (queueManager.mn[i]) {
                        queueManager.mn[i].it.style.backgroundColor = '#ffffff';
                        queueManager.mn[i].it.im.style.color = '#000000';
                        queueManager.mn[i].sm.hide(true);
                    }
                }
                //document.getElementById('tmp').value = '1';
                queueManager.it.mn.hide(true);
                queueManager.it.mn.pr.di.style.backgroundColor = '#ffffff';
                queueManager.it.mn.pr.di.im.style.color = '#000000';
                if (queueManager.it.cf.sm)
                    queueManager.it.cf.sm.hide(true);
            }
        } else {
            if (this.di.mn !== queueManager.it.cf.sm) {
                for (i = this.di.mn.cf.lv - 1; i < queueManager.it.mn.cf.lv; i++) {
                    if (queueManager.mn[i]) {
                        queueManager.mn[i].it.style.backgroundColor = '#ffffff';
                        queueManager.mn[i].it.im.style.color = '#000000';
                        queueManager.mn[i].sm.hide(true);
                    }
                }
                //document.getElementById('tmp').value = '2';
                queueManager.it.style.backgroundColor = '#ffffff';
                queueManager.it.im.style.color = '#000000';
                queueManager.it.cf.sm.hide(true);
                if (this.di.mn.cf.lv < queueManager.it.mn.cf.lv) {
                    queueManager.it.style.backgroundColor = '#ffffff';
                    queueManager.it.im.style.color = '#000000';
                    queueManager.it.mn.hide(true);
                }
            } else {
                if (this.di.mn.cf.lv < queueManager.it.mn.cf.lv) {
                    //document.getElementById('tmp').value = '3';
                    queueManager.it.mn.hide(true);
                    queueManager.it.mn.pr.di.style.backgroundColor = '#ffffff';
                    queueManager.it.mn.pr.di.im.style.color = '#000000';
                    if (queueManager.it.cf.sm)
                        queueManager.it.cf.sm.hide(true);
                }
            }
        }
        //document.getElementById('tmp').value = this.di.mn.menu.level;

        queueManager.it = null;
    }
    this.di.style.backgroundColor = this.di.mn.cf.fc;
    if (!this.di.cf.ds)
        this.di.im.style.color = this.di.mn.cf.tc;
    if (this.di.cf.sm) {
        var ps = this.di.mn.adjustPosition(this.di);
        ps.x = ps.x + this.di.mn.size.w - 10;
        this.di.cf.sm.showAt(ps, true);
        queueManager.mn[this.di.mn.cf.lv - 1] = { it: this.di, sm: this.di.cf.sm };
    }
};

BAMenu.prototype.menuItemOnClick = function () {
    if (this.di.cf.handler != null)
        this.di.cf.handler.apply(this.di.mn.sc != null ? this.di.mn.sc : this, []);
    if (queueManager.rt)
        queueManager.rt.hide();
};

BAMenu.prototype.createObject = function (w, h, c) {//, e
    var d = document.createElement('div');
    if (w > 0)
        d.style.width = w + 'px';
    if (h > 0)
        d.style.height = h + 'px';
    d.style.float = 'left';
    if (c.length > 0)
        d.className = c;
    d.oncontextmenu = this.contextMenu;
    return d;
};

BAMenu.prototype.contextMenu = function () {//e
    return false;
};

BAMenu.prototype.getWindowSize = function () {
    var ww = 0, hh = 0;
    if (window.innerWidth)
        ww = window.innerWidth;
    else if (this.isIE)
        ww = document.body.parentElement.clientWidth;
    else if (document.body && document.body.clientWidth)
        ww = document.body.clientWidth;

    if (window.innerHeight)
        hh = window.innerHeight;
    else if (this.isIE)
        hh = document.body.parentElement.clientHeight;
    else if (document.body && document.body.clientHeight)
        hh = document.body.clientHeight;

    return { w: ww, h: hh };
};

BAMenu.prototype.showAt = function (p, s) {
    if (!s) {
        if (queueManager.rt)
            queueManager.rt.hide();
        queueManager.rt = this;
        queueManager.sm = true;
    }
    var ws = this.getWindowSize();
    if (p.x + this.size.w > (ws.w - (this.isIE ? 5 : 0))) {
        p.x = p.x - this.size.w;
        if (this.pr != null)
            p.x = p.x - this.pr.mn.size.w + 20;
    }
    if (p.y + this.size.h + 20 > ws.h)
        p.y = p.y - this.size.h + 15;
    this.it.bd.style.display = '';
    this.it.bd.style.top = p.y + 'px';
    this.it.bd.style.left = p.x + 'px';
    //queueManager.sm = false;
};

BAMenu.prototype.hide = function (s) {
    if (!s) {
        for (var i = 0; i < queueManager.mn.length; i++) {
            if (queueManager.mn[i]) {
                queueManager.mn[i].it.style.backgroundColor = '#ffffff';
                queueManager.mn[i].it.im.style.color = '#000000';
                queueManager.mn[i].sm.hide(true);
            }
        }
        queueManager.rt = null;
    }
    this.it.bd.style.display = 'none';
};

BAMenu.prototype.adjustPosition = function (obj) {
    var offsetLeft = 0;
    var offsetTop = 0;
    while (obj) {
        offsetLeft += parseInt(obj.offsetLeft);
        offsetTop += parseInt(obj.offsetTop);
        obj = obj.offsetParent;
    }
    return { x: offsetLeft, y: offsetTop };
};

function BAMenuItem(config, menu, scope, focusColor, textColor, index, level) {
    this.isMenuItem = true;
    this.iconCls = config.iconCls ? ('x-menu-items-icon ' + config.iconCls) : 'x-menu-items-icon';
    this.text = config.text || '&nbsp;';
    this.scope = config.scope || null;
    this.handler = config.handler || null;
    this.ds = config.disabled || false;
    this.mn = menu;
    this.dx = index;
    this.lv = level;
    if (config.menu) {
        config.menu.focusColor = focusColor;
        config.menu.textColor = textColor;
        config.menu.index = index + 1;
        config.menu.level = level + 1;
        config.menu.scope = config.menu.scope || scope;
        this.sm = new BAMenu(config.menu);
        this.sm.pr = this;
    } else {
        this.sm = null;
    }
};

function BAMenuSeparator() {
    this.isMenuItem = false;
};

function BAQueueManager() {
    this.Queue = [[]];
};

BAQueueManager.prototype.enqueue = function (objectID, timeout, obj, func, args) {
    var pos = this.Queue.length;
    for (var i = 0; i < this.Queue.length; i++) {
        if (this.Queue[objectID][i] == null) {
            pos = i;
            break;
        }
    }
    var id = window.setTimeout("BAQueueManager_Execute(" + objectID + "," + pos + ")", timeout);
    this.Queue[objectID][pos] = new Array(id, obj, func, args);
    return pos;
};

BAQueueManager.prototype.dequeue = function (objectID, pos) {
    if (this.Queue[objectID][pos] != null) {
        window.clearTimeout(this.Queue[objectID][pos][0]);
        this.Queue[objectID][pos] = null;
    }
};

function BAQueueManager_Execute(objectID, pos) {
    if (queueManager.qu.Queue[objectID][pos] != null) {
        var obj = queueManager.qu.Queue[objectID][pos][1];
        var func = queueManager.qu.Queue[objectID][pos][2];
        if (queueManager.qu.Queue[objectID][pos][3] != null) {
            func.apply(obj, queueManager.qu.Queue[objectID][pos][3]);
        } else {
            func.apply(obj);
        }
        queueManager.qu.Queue[objectID][pos] = null;
    }
};

queueManager = {
    rt: null,
    id: -1,
    it: null,
    mn: [],
    qu: new BAQueueManager()
};