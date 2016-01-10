// create angular app
(function(){
'use strict';
angular.module('app', [])
.controller('ConttlCrud',ConttlCrud);

function ConttlCrud($http){
	var vm = this;//$scope
	vm.pr='gato';
	vm.errores= [{name:'no hay'}];
	vm.userId;//user ínfo
	
	//models empty
	vm.modelSave= {
		userId: '',
		name: '',
		type: '',
		primary: null
	};

	vm.modelDelete= {
		id: null
	};

	vm.modelUpdate= {
		userId: '',
		map: {},
		name: '',
		type: '',
		primary: null
	};
	
	//init
	init();

	//initialized
	function init(){
	    //call it here
		getUser( getMaps );
		vm.toSave = angular.copy(vm.modelSave);
		vm.toDelete = angular.copy(vm.modelDelete);
		vm.toUpdate = angular.copy(vm.modelUpdate);
	};
	
	//select edit object
	vm.selectUpdate= function(){

		vm.toUpdate.name = vm.toUpdate.map.name;
		vm.toUpdate.type = vm.toUpdate.map.type;
		vm.toUpdate.userId = vm.toUpdate.map.userId;
		vm.toUpdate.primary = vm.toUpdate.map.primary;

	};
	
	function getUser(callback){
		var req = {
			 method: 'get',
			 url: '/api/user',
			 headers: {
			   'Content-Type': 'application/json; charset=utf-8'
			 }
		};
		
		$http(req).then(

			function(res){
				vm.userId = res.data.user._id;
				callback();//getMaps
			},
			function(res){
				vm.errores= ['error getUser: ',res];
			}
		);
	};

	//methods
	function getMaps(){
		var req = {
			 method: 'get',
			 url: '/api/mapsuser/' +  vm.userId ,
			 headers: {
			   'Content-Type': 'application/json; charset=utf-8'
			 }
		};
		
		$http(req).then(

			function(res){
				vm.maps = res.data;
				//vm.errores= ['status getMaps: ',res];
			},
			function(res){
				vm.errores= ['error getMaps: ',res];
			}
		);
	};
		
	vm.saveMap = function(){
		vm.toSave.userId = vm.userId;
		console.log(vm.userId);
		var req = {
			 method: 'post',
			 url: '/api/maps',
			 headers: {
			   'Content-Type': 'application/json; charset=utf-8'
			 },
			 data: vm.toSave
		};
		
		$http(req).then(

			function(res){
				vm.maps = res.data;
				getMaps();
				vm.toSave = angular.copy(vm.modelSave);
				vm.errores= ['status saveMaps: ',res];
				
			},
			function(res){
				vm.errores= ['error save: ',res];
			}
		);
	};
	
	vm.deleteMaps = function(){
		var req = {
			 method: 'delete',
			 url: '/api/maps/'+vm.toDelete._id,
			 /*headers: {
			   'Content-Type': 'application/json; charset=utf-8'
			 },
			 data: vm.toDelete*/
		};
		
		$http(req).then(

			function(res){
				vm.maps = res.data;
				getMaps();
				//vm.toDelete = angular.copy(vm.modelDelete);
				vm.errores= ['status deleteMaps: ',res];
			},
			function(res){
				vm.errores= ['error delete: ',res];
			}
		);
		
	};
	
	vm.updateMap = function(){
		var req = {
			 method: 'put',
			 url: '/api/maps/'+vm.toUpdate.map._id,
			 headers: {
			   'Content-Type': 'application/json; charset=utf-8'
			 },
			 data: vm.toUpdate
		};
		
		$http(req).then(

			function(res){
				//vm.maps = res.data;
				getMaps();
				vm.toUpdate = angular.copy(vm.modelUpdate);
				vm.errores= ['status updatetMaps: ',res];
				
			},
			function(res){
				vm.errores= ['error updater: ',res];
			}
		);
		
	};
	
	
}
})();
