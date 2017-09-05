'use strict';
angular
    .module('app')
    .controller('DashboardController', DashboardController);

function DashboardController($scope,$location,$http,$interval,$window, $rootScope) {

    $scope.dateTime = "";
    $scope.selectPeriod = ["Semana", "Meses"];
    $scope.drivers = [];
    $scope.users = [];
    $scope.zonas = [];
    $scope.currentOrders = [];
    $scope.periodChart = {period: 'Semana'};
    $scope.recentFeed = [];
    $scope.lastMonth = {
        viajes: 29,
        usuarios: 14
    }
    $scope.today = {
        viajes: 11,
        usuarios: 4
    }

    var topUsers = [70,30];
    var topZones = [];
    var topZonesNames = [];
    var monthStats = {
        users: [0, 10, 5, 2, 20, 30, 45,32,12],
        orders: [5, 20, 15, 8, 11, 26, 40, 21, 18],
        labels: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre"],
    }
    var weekStats = {
        users: [0, 10, 5, 2, 20, 30, 45],
        orders: [5, 20, 15, 8, 11, 26, 40],
        labels: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]
    }
    var lineChart;
    var ctxLine = document.getElementById('line-chart').getContext('2d');

    Chart.defaults.global.tooltips.bodyFontColor = "rgba(0,0,0,0.87)";
    Chart.defaults.global.tooltips.titleFontColor = "rgba(0,0,0,0.87)";
    Chart.defaults.global.tooltips.backgroundColor = "rgba(245, 248, 239, 1)";
    Chart.defaults.global.tooltips.bodyFontFamily = "Roboto";
    Chart.defaults.global.tooltips.bodyFontSize = 14;
    Chart.defaults.global.tooltips.titleFontFamily = "Roboto";
    Chart.defaults.global.tooltips.titleFontSize = 14;
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.defaultFontSize = 13;

    function addCurrentOrder(){
        var usuarioIndex = Math.floor(Math.random() * $scope.users.length);
        var zonaIndex = Math.floor(Math.random() * $scope.zonas.length);
        var usuario = $scope.users[usuarioIndex].name;
        var zona = $scope.zonas[zonaIndex].zona;
        var conductor = $scope.drivers[Math.floor(Math.random() * $scope.drivers.length)].name;
        var fecha = moment().format('L');
        $scope.currentOrders.unshift({
            "usuario": usuario,
            "zona-origen": zona,
            "conductor": conductor,
            "direccion-origen": "",
            "dirección-destino": "",
            "terminado": false,
            "fecha": fecha
        });
        monthStats.orders[8] += 1;
        weekStats.orders[moment().day()-1] +=1;
        setLineDataSets(monthStats);
        setLineDataSets(weekStats);
        $scope.switchLineChart();
        $scope.lastMonth.viajes += 1;
        $scope.today.viajes += 1;
        $scope.users[usuarioIndex].orders += 1;
        sort($scope.users,"orders");
        topZones[zonaIndex] += 1;
        topZonesChart();
        $scope.recentFeed.unshift(usuario + " ha realizado un pedido. Conductor asignado: " + conductor);
    }

    function finishOrder(){
        var viaje ={terminado:true};
        var index;
        while(viaje.terminado){
            index = Math.floor(Math.random() * $scope.currentOrders.length);
            viaje = $scope.currentOrders[index];
        }
        $scope.currentOrders[index].terminado = true;
        var usuario = viaje.usuario;
        $scope.recentFeed.unshift("El paquete de " + usuario + " ha entregado sido entregado.");
    }

    var names = ["Andrés Saracho", "Adriana Molina","Luis García","Alexa Romero","Karla Miranda","José Arizmendi"];
    function newUser(){
        var newUser = names.shift();
        $scope.users.push({
            "name": newUser,
            "orders": 0
        })
        sort($scope.users,"orders");
        $scope.recentFeed.unshift("Nuevo Usuario: " + newUser);
        monthStats.users[8] += 1;
        weekStats.users[moment().day()-1] +=1;
        setLineDataSets(monthStats);
        setLineDataSets(weekStats);
        $scope.switchLineChart();
        $scope.lastMonth.usuarios += 1;
        $scope.today.usuarios += 1;
    }

    function sort(array, obj){
        var i, key, current;
        for(var j = 1; j < array.length; j++){
            current = array[j];
            key = current[obj];
            i = j-1;
            while(i >= 0 && array[i][obj] < key){
                array[i+1] = array[i];
                i -= 1;
            }
            array[i+1] = current;
        }
    }

    function setLineDataSets(obj){
        lineChart = {
            type: 'line',
            data: {
                labels: obj.labels,
                datasets: [{
                    label: 'Usuarios nuevos',
                    borderColor: 'rgb(153,194,77)',
                    backgroundColor: 'rgba(153,194,77,0.5)',
                    data: obj.users,
                    borderWidth: 1,
                }, {
                    label: 'Viajes',
                    borderColor: 'rgb(65, 187, 217)',
                    backgroundColor: 'rgba(65, 187, 217, 0.5)',
                    data: obj.orders,
                    borderWidth: 1,
                }, ]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    xAxes: [{
                                gridLines: {
                                    display:false
                                }
                            }],
                    yAxes: [{
                                gridLines: {
                                    display:false
                                }   
                            }]
                },
                legend: {
                            display:true,
                            position: 'right'
                        }
            }
        }
    }

    function setDoughnutChart(color, data, num){
        var doughnutChart = {
            type: 'doughnut',
            data: {
                datasets: [{
                    backgroundColor: color,
                    data: data,
                    borderWidth: [0,0],
                }],
                hoverBorderWidth: [0,0]
            },
            options: {
                responsive: true,
                cutoutPercentage: 80,
                layout:{
                    padding:{
                        top: 20,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }
                },
                legend: {
                    display: false,
                }
            }
        }
        return doughnutChart;
    }

    
    $scope.switchLineChart = function(){
        var myLineChart;
        if($scope.periodChart.period === "Semana"){
            setLineDataSets(weekStats);
            myLineChart = new Chart(ctxLine, lineChart, "20%");
        } else{
            setLineDataSets(monthStats)
            myLineChart = new Chart(ctxLine, lineChart, '30%');
        }
    }
    $scope.switchLineChart();

    function newUsersChart(){
        var newUsersId = document.getElementById('new-users-chart').getContext('2d');
        var chart = setDoughnutChart(['#006E90','rgba(0,0,0,0.2)'],topUsers);
        var chartUsers = new Chart(newUsersId, chart);    
    }

    function ordersChart(){
        var ordersId = document.getElementById('orders-chart').getContext('2d');
        var chart = setDoughnutChart(['#F18F01','rgba(0,0,0,0.2)'],[40,60]);
        var chartUsers = new Chart(ordersId, chart);  
    }

    function topZonesChart(){
        var topAreas = document.getElementById('zone-chart').getContext('2d');
        var chartAreas = new Chart(topAreas, {
            type: 'bar',
            data: {
                datasets: [{
                    label: topZonesNames[0],
                    backgroundColor: 'rgba(72,60,70,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(72,60,70)',
                    data:  [topZones[0]]
                },{
                    label: topZonesNames[1],
                    backgroundColor: 'rgba(60,110,113,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(60,110,113)',
                    data:  [topZones[1]]
                },{
                    label: topZonesNames[2],
                    backgroundColor: 'rgba(112,174,110,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(112,174,110)',
                    data:  [topZones[2]]
                },{
                    label: topZonesNames[3],
                    backgroundColor: 'rgba(190,238,98,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(190,238,98)',
                    data:  [topZones[3]]
                },{
                    label: topZonesNames[4],
                    backgroundColor: 'rgba(142,227,239,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(142,227,239)',
                    data:  [topZones[4]]
                },{
                    label: topZonesNames[5],
                    backgroundColor: 'rgba(255,155,84,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(255,155,84)',
                    data:  [topZones[5]]
                },{
                    label: topZonesNames[6],
                    backgroundColor: 'rgba(255,127,81,0.5)',
                    borderWidth: 1,
                    borderColor: 'rgb(255,127,81)',
                    data: [topZones[6]]
                }],
                labels: ["Zonas"]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    xAxes: [{
                                gridLines: {
                                    display:false
                                },
                                barPercentage: 0.4,
                                categoryPercentage: 0.9
                            }],
                    yAxes: [{
                                gridLines: {
                                    display:false
                                }   
                            }]
                },
                layout:{
                    padding:{
                        top: 20,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }
                },
                legend: {
                        display:true,
                        position: "right",
                        labels:{
                            boxWidth: 15
                        }
                }
            }
        });
    }

    $http.get('api/drivers.json').
        then(function(response) {
            $scope.drivers = response.data;
    });

    $http.get('api/viajes.json').
        then(function(response) {
            $scope.currentOrders = response.data;
            for(var i=0; i<$scope.currentOrders.length; i++){
                $scope.currentOrders[i].fecha = moment().format('L');
                $scope.recentFeed[i] = ($scope.currentOrders[i].usuario + " ha realizado un pedido. Conductor asignado: " + $scope.currentOrders[i].conductor+".");
            }
            ordersChart();
    });

    $http.get('api/users.json').
        then(function(response) {
            $scope.users = response.data;
            newUsersChart();
            sort($scope.users, "orders");
    });

    $http.get('api/zonas.json').
        then(function(response) {
            $scope.zonas = response.data;
            for(var i=0; i<$scope.zonas.length; i++){
                topZones[i] = $scope.zonas[i].origen;
                topZonesNames[i] = $scope.zonas[i].zona
            }
            topZonesChart();
    });

    //Datetime
    moment.locale('es', {
        months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort : 'en._febr._mzo._abr._may._jun._jul._agto._sept._oct._nov._dic.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado_Domingo'.split('_'),
        weekdaysShort : 'dom._lun._mar._mier._jue._vier._sab.'.split('_'),
        weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        }
    });
    moment.locale('es');

    function updateDateTime() {
        $scope.dateTime = moment().format('LLLL');
        $('#clock').html($scope.dateTime);
    }

    $interval(updateDateTime, 1000);
    $interval(addCurrentOrder, 7500);
    $interval(finishOrder, 10000);
    $interval(newUser, 20000);


    $(document).ready(function() {
        $('select').material_select();
        $(".button-collapse").sideNav();
        $.simpleWeather({
          location: 'Guadalajara, JA',
          woeid: '',
          unit: 'c',
          success: function(weather) {
            var html = '<span class="card-title"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span>';
            html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
        
            $("#weather").html(html);
          },
          error: function(error) {
            $("#weather").html('<p>'+error+'</p>');
          }
        });
      });

      $(window).scroll(function(){
        if ($(window).scrollTop() >= $('.navbar-fixed').height()+$('#weather-card').height()-65 && $(window).width() > 992) {
             $("#right-feed").css({'position': 'fixed','right':'0','width':'21.3%','top':'64px'});
        } else{
            $("#right-feed").css({'position': '','right':'','width':'','top':''});
        }
    });

    
    
    
}

DashboardController.$inject = ['$scope','$location','$http','$interval','$window','$rootScope'];