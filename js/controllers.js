angular.module('starter.controllers', [])
.controller('mainController', function($scope,$ionicPlatform,$rootScope) {
	$ionicPlatform.ready(function() {
		$rootScope.IOS = ionic.Platform.isIOS();
		$rootScope.Android = ionic.Platform.isAndroid();
		if($rootScope.IOS==true){
			$scope.layout='style-ios'
		}else if($rootScope.Android==true){
			$scope.layout='style-android'
		}
	})
})
.controller('loginCtrl', function($scope,$timeout,$cordovaNetwork,$cordovaDialogs,$location,$ionicLoading,$ionicPopup,$ionicTabsDelegate,$http,$rootScope,$cordovaToast) {
	$scope.loginData={username:'',password:''};
	$scope.hidetabb=$rootScope.hidetab;
	$scope.logIn = function (loginData) {
		$ionicLoading.show({
		template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
		});
		if($cordovaNetwork.isOffline())
		{
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please Connect with internet'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please Connect with internet', 'Sorry', 'ok')
				.then(function() {
				});
				return false;
			}	
		}
		else if($scope.loginData.username==""){
			$ionicLoading.hide()
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please Enter Username'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please Enter Username', 'Sorry', 'OK')
				.then(function() {
				});
				return false;
			}	
		}
		else if($scope.loginData.password=="")
		{
			$ionicLoading.hide()
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please Enter Password'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please Enter Password', 'Sorry', 'ok')
				.then(function() {
				});
				return false;
			}	
			
		}
		else
		{
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.loginData.username='';
					$scope.loginData.password='';
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			$http.post('http://app.sterlinghsa.com/api/v1/user/login',{username:$scope.loginData.username,password:$scope.loginData.password},{headers: {'Content-Type':'application/json; charset=utf-8'} })     
			.success(function(data) {
				if(data.status == "SUCCESS"){
					$timeout.cancel(timer);
					$ionicLoading.hide()
					localStorage.setItem('access_token',data.access_token);
					localStorage.setItem('username',$scope.loginData.username);
					window.location.href = 'index.html#/app/hsa';				
				}else if(data.status=="FAILED"){
					$timeout.cancel(timer);
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: 'Username or password is incorrect'
						});
						alertPopup.then(function(res) {
						});
					}else{
						$cordovaDialogs.alert('Username or password is incorrect ', 'Sorry', 'OK')
							.then(function() {
						});
						return false;
					}	
				}
			}).error(function(err){		
			});
		}
	}
})
//HSA Start//
.controller('HsaCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$ionicHistory,$ionicTabsDelegate,$ionicPopup) {
 
	$scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }
    
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
    .success(function(data){
    $rootScope.acctype=data.account_types;
    if(data.account_types.HSA!=undefined){
     localStorage.setItem('account_types',data.account_types.HSA);
     $scope.account_type=data.account_types.HSA;
     $rootScope.hsaaccno=data.account_types.HSA.ACCT_NUM;
     $rootScope.hsaaccId=data.account_types.HSA.ACCT_ID;
    }else if(data.account_types.FSA!=undefined){
     localStorage.setItem('account_types',data.account_types.FSA);
     $scope.account_types=data.account_types.FSA;
     $rootScope.fsaaccno=data.account_types.FSA.ACCT_NUM;
     $rootScope.fsaaccId=data.account_types.FSA.ACCT_ID;
    }else if(data.account_types.HRA!=undefined){
     localStorage.setItem('account_types',data.account_types.HRA);
     $scope.account_types=data.account_types.HRA;
     $rootScope.hraaccno=data.account_types.HRA.ACCT_NUM; 
     $rootScope.hraaccId=data.account_types.HRA.ACCT_ID;
    }else if(data.account_types.COBRA!=undefined){
     localStorage.setItem('account_types',data.account_types.COBRA);
     $scope.account_types=data.account_types.COBRA;
     $rootScope.hraaccno=data.account_types.COBRA.ACCT_NUM; 
     $rootScope.hraaccId=data.account_types.COBRA.ACCT_ID;
     $rootScope.cobrassn=data.account_types.COBRA.SSN;
    }
	
		$http.get(' http://app.sterlinghsa.com/api/v1/accounts/list',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			//alert(data.accounts.length)
			for(var i=0;i<data.accounts.length;i++){
				if($rootScope.hsaaccno==data.accounts[i].ACC_NUM){
					//alert("HSA-"+data.accounts[i].PLAN_NAME)
					$rootScope.hsaaccno=data.accounts[i].ACC_NUM;
					$rootScope.hsaaccId=data.accounts[i].ACC_ID;
					$rootScope.hsaaccbalance=data.accounts[i].ACCT_BALANCE;
				}
			}
		}).error(function(err){

		});
    
		$http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'hsa','acc_num': data.account_types.HSA.ACCT_NUM},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
		$scope.contributions=data.total_contributions.CURRENT_YR_CONTRB;
		}).error(function(err){

		});
		$scope.debit();
      }).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
   });
   
   $scope.debit=function(){
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
				$scope.hsa_debit_card_list=data.debit_card_list[0];
				$rootScope.hsa_debit_card_transNo = $scope.debit_card_list.TRANSACTION_NUMBER;
				$rootScope.hsa_debit_card_amount = $scope.debit_card_list.AMOUNT;
		}).error(function(err){
			$ionicLoading.hide();
		});
	}
   
})
.controller('makecontributeCtrl', function($scope,$cordovaNetwork,$rootScope,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.TransDate="";
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.hsaacctype=$rootScope.hsaacctype;
	$scope.acc_num=$rootScope.hsaaccno;
	$scope.makecontribute={selectAccount:'',amount:'',TransDate:'',feeamount:'',selectdescription:''};
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.floatlabel=false;
	$scope.floatlabel1=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	$scope.currentYear = $filter('date')(new Date(),'yyyy');
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	$scope.SelectFloat1 = function ()
	{ 
		$scope.floatlabel1=true;
	}
	
	$scope.getTransDate=function(){
		var today = new Date();
		//var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf()+1493998268893;
		
		if($rootScope.IOS==true){
			
			if(today.getDay()==5){
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 72 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000);
			}else if(today.getDay()==6){
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 48 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
			}else{
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			}
			
			if($scope.makecontribute.TransDate){
				var options = {
					date: new Date($scope.makecontribute.TransDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}else{
				var options = {
					date: new Date(startDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}
		}else{
			if(today.getDay()==5){
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 72 * 60 * 60 * 1000)).valueOf();
			}else if(today.getDay()==6){
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 48 * 60 * 60 * 1000)).valueOf();
			}else{
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).valueOf();
			}
			if($scope.makecontribute.TransDate){
				var options = {
					date: new Date($scope.makecontribute.TransDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}else{
				var options = {
					date: new Date(),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}
		}
		
		$ionicPlatform.ready(function(){
			$cordovaDatePicker.show(options).then(function(date){
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.makecontribute.TransDate=selectedDate;
			});
		})

	};
	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}	
	}else{
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hsa', 'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.status=="FAILED"){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
			$scope.bank_details=data.bank_details;
		}).error(function(err){	
		});
	}
	
    $http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'hsa','acc_num': $scope.acc_num},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$ionicLoading.hide();
		$scope.total_contribution = data.total_contributions;
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	});
 
	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/description',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.description=data.description ;
	}).error(function(err){
	});
 
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/balances",{params:{'type':'hra'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		$scope.Availablebalance=data.balances.BALANCE;
	}).error(function(err){
	});	
  
	$scope.submitvalues=function(){
		if($scope.makecontribute.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});

			}	
		}else if($scope.date >= new Date($scope.makecontribute.TransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select future date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select future date','Sorry','OK')
				.then(function() {
				});
			}
		}else if(new Date($scope.makecontribute.TransDate).getDay()==6 || new Date($scope.makecontribute.TransDate).getDay()==0 ){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select Weekdays'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select Weekdays','Sorry','OK')
				.then(function() {
				});
			}
		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.makecontribute={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			//alert(JSON.stringify($scope.makecontribute))
			$http.post(" http://app.sterlinghsa.com/api/v1/accounts/makecontribution",{'acct_id':$scope.hsaaccId,'acct_type':$scope.hsaacctype,'bank_acct_id':$scope.makecontribute.selectAccount.BANK_ACC_ID,'amount':$scope.makecontribute.amount,'fee_amount':$scope.makecontribute.feeamount,'reason_code':$scope.makecontribute.selectdescription.FEE_CODE,'trans_date':$scope.makecontribute.TransDate},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS")
				{
					$timeout.cancel(timer);
					$ionicLoading.hide();
					$scope.transactionid = data.transaction_id;	
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Contribution Submitted Successfully',
							template: 'Transaction ID is '+ "" + $scope.transactionid 
						});

						alertPopup.then(function(res) {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							$scope.myForm.setPristine();
						});
					}else{
						$cordovaDialogs.alert('Transaction ID is '+ "" + $scope.transactionid , 'Contribution Submitted Successfully', 'OK')
						.then(function() {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							$scope.myForm.setPristine();

						});
						return false;
					}	
					
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message 
						});

						alertPopup.then(function(res) {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							$scope.myForm.setPristine();
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function() {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
					});
					return false;
					}						
				}
			}).error(function(err){
			});
		}
	}
	
	$scope.goback=function()
	{
		$location.path("/app/hsa")
	}
	
})
.controller('AccountCtrl', function($rootScope,$scope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$ionicHistory,$ionicPopup,$filter,$timeout,$cordovaToast) {
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.acc_num=$rootScope.hsaaccno;
	$scope.currentYear = $filter('date')(new Date(),'yyyy');
	//alert($scope.currentYear)

	var timer=$timeout(function(){
		//alert("Your request time out");
		$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
			// success
			$scope.makecontribute={};
			$ionicLoading.hide();
		}, function (error) {
		// error
		});
	},30000)
	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'hsa','acc_num': $scope.acc_num},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$ionicLoading.hide();
		$timeout.cancel(timer);
		localStorage.setItem('account_information',data.account_information);
		localStorage.setItem('total_contributions',data.total_contributions);
		$scope.account_information=data.account_information;
		$rootScope.total_contributions = data.total_contributions;

	}).error(function(err){
		$timeout.cancel(timer);
		$ionicLoading.hide();
	});
	
	$scope.goback=function()
	{
		window.history.back();
	}
			
})
.controller('ActivitystmntCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$filter,$cordovaFile,$cordovaFileOpener2,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.activity={startDate:'',EndtDate:''};
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	
	$scope.downloadStatement=function(){	

		if($scope.activity.EndtDate=="" || $scope.activity.startDate ==""){
			
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select date'
				});

				alertPopup.then(function(res) {
					//$location.path('activitystmnt');
				});
			}else{
				$cordovaDialogs.confirm('Please select date', 'Sorry', 'ok')
				.then(function(buttonIndex)
				{
					if(buttonIndex=="1")
					{
						//$location.path('activitystmnt');
					}
				});
				return false;
			}
			
		}else if(new Date($scope.activity.startDate) > new Date($scope.activity.EndtDate)){
			
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'From date should be less then To date'
				});

				alertPopup.then(function(res) {
					//$location.path('activitystmnt');
				});
			}else{
				$cordovaDialogs.confirm('From date should be less then To date', 'Sorry', 'ok')
				.then(function(buttonIndex)
				{
					if(buttonIndex=="1")
					{
						//$location.path('activitystmnt');
					}
				});
				return false;
			}

		}
		else{
			
			$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
			.success(function(data){
				
				$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
				});
				var timer=$timeout(function(){
					//alert("Your request time out");
					$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
						// success
						$scope.makecontribute={};
						$ionicLoading.hide();
					}, function (error) {
					// error
					});
				},30000)
				
				if($rootScope.IOS==true){
					$http({
						url : ' http://app.sterlinghsa.com/api/v1/accounts/activitystatementpdf',
						data:{fromdate:$scope.activity.startDate,todate:$scope.activity.EndtDate, account:$rootScope.hsaaccno},
						method : 'POST',
						responseType : 'arraybuffer',
						headers: {
							'Authorization':$scope.access_token
						},
						cache: true,
					}).success(function(data) {
						$ionicLoading.hide();
						$timeout.cancel(timer);
						var blob = new Blob([data], { type: 'application/pdf' });
						var fileURL = URL.createObjectURL(blob);
						var fileName = $filter('date')(new Date(),'HHmmss')+".pdf";
						var contentFile = blob;
						$cordovaFile.writeFile(cordova.file.dataDirectory, fileName,contentFile, true)
						.then(function (success) {
							//alert("writeFile"+JSON.stringify(success));
							$cordovaFileOpener2.open(cordova.file.dataDirectory+fileName,'application/pdf')
							.then(function(){
								//alert("open")
							},function(err){
								//alert("Error");
								//alert(JSON.stringify(err));
							})
							$scope.activity={};
						}, function (error){	
							// alert("error")
						});
					}).error(function(data){});
				}else{
					$http({
						url : ' http://app.sterlinghsa.com/api/v1/accounts/activitystatementpdf',
						data:{fromdate:$scope.activity.startDate,todate:$scope.activity.EndtDate, account:$rootScope.hsaaccno},
						method : 'POST',
						responseType : 'arraybuffer',
						headers: {
							'Authorization':$scope.access_token
						}
					})
					.success(function(data) {
						$ionicLoading.hide();
						$timeout.cancel(timer);
						var blob = new Blob([data], { type: 'application/pdf' });
						var fileURL = URL.createObjectURL(blob);
						var fileName = $filter('date')(new Date(),'HHmmss')+".pdf";
						var contentFile = blob;
						$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration", true)
						.then(function (success) {
							$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
							.then(function (success) {
								$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
								.then(function(){
									$scope.activity={};
								},function(err){})
								}, function (error){	
								});
						},function (error){
						});
					}).error(function(data){});
				}
			}).error(function(err){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'Session expired, Please Login Again'
					});

					alertPopup.then(function(res) {
						localStorage.clear();
						$location.path("/login");
					});
				}else{
					$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
					.then(function(buttonIndex) {
						if(buttonIndex=="1")
						{
							localStorage.clear();
							$location.path("/login");
						}
					});
					return false;
				}
			});
		}
	};

	$scope.getStartDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.activity.startDate=selectedDate;

		});
	};
	
	$scope.getEndDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.activity.EndtDate=selectedDate;

		});
	}

	$scope.goback=function()
	{
		$rootScope.hidecontent=true;
		$scope.activity={};
		$location.path("app/hsa");
		
	}
})
.controller('PaymeCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaImagePicker,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaCamera,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.paymeValues={selectAccount:'',amount:'',TransDate:'',category:'',imgValue:''};
	$scope.access_token = localStorage.getItem('access_token');
    $scope.hsaaccId=$rootScope.hsaaccId;
    $scope.hsaaccno=$rootScope.hsaaccno;
	$scope.msghide=true;
	$scope.floatlabel=false;
	$scope.floatlabel1=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	$scope.SelectFloat1 = function ()
	{ 
		$scope.floatlabel1=true;
	}
	
	
	$scope.myAvlBalance = function(){
		if($scope.Availablebalance < 0){
			$scope.paymeValues.amount='';
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have sufficient balance to schedule this disbursement'
				});

				alertPopup.then(function(res) {
					//window.history.back();
				});
			}else{
				$cordovaDialogs.alert('You do not have sufficient balance to schedule this disbursement','Sorry','OK')
				.then(function() {
					//window.history.back();
				});
			}
		}
		
	}
	
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
					maximumImagesCount: 5,
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
					
				} else {
					var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
		.then(function(options) {
			if(options==1){
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}else if(options==2){
				var options = {
					maximumImagesCount: 5,
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}
		});
		}
	}
	
	$scope.TransDate="";
	$scope.getTransDate=function(){
		var today = new Date();
		if($rootScope.IOS==true){
			if(today.getDay()==5){
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 72 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000);
			}else if(today.getDay()==6){
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 48 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
			}else{
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			}
			if($scope.paymeValues.TransDate){
				var options = {
					date: new Date($scope.paymeValues.TransDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}else{
				var options = {
					date: new Date(startDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}
		}else{
			
			if(today.getDay()==5){
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 72 * 60 * 60 * 1000)).valueOf();
			}else if(today.getDay()==6){
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 48 * 60 * 60 * 1000)).valueOf();
			}else{
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).valueOf();
			}
			if($scope.paymeValues.TransDate){
				var options = {
					date: new Date($scope.paymeValues.TransDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}else{
				var options = {
					date: new Date(),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}
			
		}
		
		$ionicPlatform.ready(function(){
			$cordovaDatePicker.show(options).then(function(date){
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.paymeValues.TransDate=selectedDate;
			});
		})
	};
	 	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.alert('Please Connect with internet', 'Sorry', 'ok')
			.then(function() {
			});
			return false;
		}
	}else{
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hsa', 'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			if(data.status=="FAILED"){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
			$scope.bank_details=data.bank_details;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	 
	$http.get('  http://app.sterlinghsa.com/api/v1/accounts/categories',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.categories=data.categories;
		}).error(function(err){
    });
 
	$scope.balCheck=function(){
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/balances",{params:{'type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$scope.Availablebalance=data.balances.BALANCE;
		}).error(function(err){

		});
	}
	$scope.balCheck();
	$scope.payme=function(myForm){
		if($scope.paymeValues.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if($scope.date >= new Date($scope.paymeValues.TransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select future date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select future date','Sorry','OK')
				.then(function() {
				});
			}
		}else if(new Date($scope.paymeValues.TransDate).getDay()==6 || new Date($scope.paymeValues.TransDate).getDay()==0 ){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select Weekdays'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select Weekdays','Sorry','OK')
				.then(function() {
				});
			}
		}else {	
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.paymeValues={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/payme",{'hsa_acct_id': $scope.hsaaccId,'bank_acct_id':$scope.paymeValues.selectAccount.BANK_ACC_ID,'amount':$scope.paymeValues.amount,'category':$scope.paymeValues.category.LOOKUP_CODE,'trans_date':$scope.paymeValues.TransDate,"receipt":$scope.imgSrc,"file_name":$scope.randomFile,"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					$scope.transactionid = data.transaction_id;
					$scope.balCheck();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Disbursement Submitted Successfully',
							template: 'Please reference this Disbursement number'+ " " + $scope.transactionid +" "+'for further communication.'
						});

						alertPopup.then(function(res) {
							if($scope.imgSrc!=undefined){
								$scope.imgSrc= '';
							}
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.paymeValues={};
						$scope.floatlabel=false;
						$scope.floatlabel1=false;
						});
					}else{
							$cordovaDialogs.alert('Please reference this Disbursement number'+ " " + $scope.transactionid +" "+'for further communication.', 'Disbursement Submitted Successfully', 'OK')
							.then(function() {
							if($scope.imgSrc!=undefined){
								$scope.imgSrc= '';
							}
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.paymeValues={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;	
						});
						return false;
					}	
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					$scope.transactionid = data.transaction_id;
					if($scope.transactionid){
						if($rootScope.IOS==true){
							var alertPopup = $ionicPopup.alert({
								title: 'Disbursement Submitted Successfully',
								template: 'Please reference this Disbursement number'+ " " + $scope.transactionid +" "+'for further communication.'
							});

							alertPopup.then(function(res) {
								if($scope.imgSrc!=undefined){
									$scope.imgSrc= '';
								}
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.paymeValues={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							});
						}else{
								$cordovaDialogs.alert('Please reference this Disbursement number'+ " " + $scope.transactionid +" "+'for further communication.', 'Disbursement Submitted Successfully', 'OK')
								.then(function() {
								if($scope.imgSrc!=undefined){
									$scope.imgSrc= '';
								}
								var myEl = angular.element( document.querySelector( '#receipt' ) );
								myEl.removeAttr('src');
								$scope.paymeValues={};
								$scope.floatlabel=false;
								$scope.floatlabel1=false;	
							});
							return false;
						}
					}else{
						if($rootScope.IOS==true){
							var alertPopup = $ionicPopup.alert({
								title: 'Sorry',
								template: data.error_message
							});

							alertPopup.then(function(res) {
								if($scope.imgSrc!=undefined){
									$scope.imgSrc= '';
								}
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.paymeValues={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							});
						}else{
							$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
							.then(function($setUntouched,$setPristine) {
							if($scope.imgSrc!=undefined){
								$scope.imgSrc= '';
							}
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.paymeValues={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							
							});
							return false;
						}
					}
				}
			}).error(function(err){
			});
		}

	}

	 $scope.$on('$ionicView.beforeEnter', function () {
           $scope.goback();
     });

	$scope.goback=function(input)
	{
		$location.path("app/hsa");
	}
	
	
})
.controller('PayproviderCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$cordovaCamera,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.payprovierValues={selectPayee:'',patient_name:'',amount:'',TransDate:'',description:''};
	$scope.floatlabel=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	$scope.TransDate="";
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
					maximumImagesCount: 5,
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
					
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc= imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
		.then(function(options) {
			if(options==1){
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}else if(options==2){
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}
		});
		return false;
		}
		
	}
	
	
	$scope.getTransDate=function(){
		var today = new Date();
		if($rootScope.IOS==true){
			if(today.getDay()==5){
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 72 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000);
			}else if(today.getDay()==6){
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 48 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
			}else{
				var maxDate = ionic.Platform.isAndroid() ? new Date() : (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).valueOf();
				var startDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			}
			if($scope.payprovierValues.TransDate){
				var options = {
					date: new Date($scope.payprovierValues.TransDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}else{
				var options = {
					date: new Date(startDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}
		}else{
			if(today.getDay()==5){
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 72 * 60 * 60 * 1000)).valueOf();
			}else if(today.getDay()==6){
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 48 * 60 * 60 * 1000)).valueOf();
			}else{
				var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).valueOf();
			}
			if($scope.payprovierValues.TransDate){
				var options = {
					date: new Date($scope.payprovierValues.TransDate),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}else{
				var options = {
					date: new Date(),
					mode: 'date', // or 'time'
					minDate: maxDate
				}
			}
		}
		
		$ionicPlatform.ready(function(){
			$cordovaDatePicker.show(options).then(function(date){
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.payprovierValues.TransDate=selectedDate;
			});
		})
	};
	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
	}else{
		$http.get('  http://app.sterlinghsa.com/api/v1/accounts/categories',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			$scope.categories=data.categories;
		}).error(function(err){
		});
	 
		$http.get(' http://app.sterlinghsa.com/api/v1/accounts/description',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			$scope.descriptions=data.description ;
		}).error(function(err){
		});
		
		$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			//alert(data.payee.length)
			if(data.payee==null){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have any pay provider on record.You must add a pay provider account by logging into www.sterlingadministration.com to schedule new claim request for pay provider'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have any pay provider on record.You must add a pay provider account by logging into www.sterlingadministration.com to schedule new claim request for pay provider','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
			$scope.payee=data.payee ;
		}).error(function(err){
		});
		
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/balances",{params:{'type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$scope.availablebalance=data.balances.BALANCE;
		}).error(function(err){

		});
	}
	
	$scope.myAvlBalance=function(){
		if($scope.availablebalance < 0){
			$scope.payprovierValues.amount='';
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have sufficient balance to schedule this disbursement'
				});

				alertPopup.then(function(res) {
					//window.history.back();
				});
			}else{
				$cordovaDialogs.alert('You do not have sufficient balance to schedule this disbursement','Sorry','OK')
				.then(function() {
					//window.history.back();
				});
			}
		}
	}
	
	$scope.submitValue=function()
	{
		if($scope.payprovierValues.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if($scope.date >= new Date($scope.payprovierValues.TransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select future date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select future date','Sorry','OK')
				.then(function() {
				});
			}
		}else if(new Date($scope.payprovierValues.TransDate).getDay()==6 || new Date($scope.payprovierValues.TransDate).getDay()==0 ){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select Weekdays'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select Weekdays','Sorry','OK')
				.then(function() {
				});
			}
		}else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.payprovierValues={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)

			$http.post("http://app.sterlinghsa.com/api/v1/accounts/payprovider",{'hsa_acct_id':$scope.hsaaccId,'vendor_id':$scope.payprovierValues.selectPayee.VENDOR_ID,'amount':$scope.payprovierValues.amount,'patient_name':$scope.payprovierValues.patient_name,'trans_date':$scope.payprovierValues.TransDate,"receipt":$scope.imgSrc,"file_name":$scope.randomFile,"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

				if(data.status == "SUCCESS")
				{
					$ionicLoading.hide();
					$timeout.cancel(timer);
					$scope.transactionid = data.transaction_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Submitted Successfully',
							template: 'Your Tansaction ID '+ "--->" + $scope.transactionid
						});

						alertPopup.then(function(res) {
							if($scope.imgSrc!=undefined){
								$scope.imgSrc= '';
							}
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.payprovierValues={};
						$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert('Your Tansaction ID '+ "--->" + $scope.transactionid , 'Submitted successsfully', 'OK')
						.then(function() {
							if($scope.imgSrc!=undefined){
								$scope.imgSrc= '';
							}
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.payprovierValues={};
							$scope.floatlabel=false;
						});
						return false;

					}
					
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					$scope.transactionid = data.transaction_id;
					if($scope.transactionid){
						if($rootScope.IOS==true){
							var alertPopup = $ionicPopup.alert({
								title: 'Submitted Successfully',
								template: 'Your Tansaction ID '+ "--->" + $scope.transactionid
							});

							alertPopup.then(function(res) {
								if($scope.imgSrc!=undefined){
									$scope.imgSrc= '';
								}
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.payprovierValues={};
							$scope.floatlabel=false;
							});
						}else{
							$cordovaDialogs.alert('Your Tansaction ID '+ "--->" + $scope.transactionid , 'Submitted successsfully', 'OK')
							.then(function() {
								if($scope.imgSrc!=undefined){
									$scope.imgSrc= '';
								}
								var myEl = angular.element( document.querySelector( '#receipt' ) );
								myEl.removeAttr('src');
								$scope.payprovierValues={};
								$scope.floatlabel=false;
							});
							return false;

						}
					}else{
						if($rootScope.IOS==true){
							var alertPopup = $ionicPopup.alert({
								title: 'Sorry',
								template: data.error_message
							});

							alertPopup.then(function(res) {
								$scope.imgSrc= '';
								var myEl = angular.element( document.querySelector( '#receipt' ) );
								myEl.removeAttr('src');
								$scope.payprovierValues={};
								$scope.floatlabel=false;
							});
						}else{
							$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function() {
								$scope.imgSrc= '';
								var myEl = angular.element( document.querySelector( '#receipt' ) );
								myEl.removeAttr('src');
								$scope.payprovierValues={};
								$scope.floatlabel=false;
							});
							return false;
						}
					}
				}
			}).error(function(err){
			});
		}

	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=true;
		$location.path("app/hsa");
	}
	
})
.controller('TaxyearCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,	$rootScope,$sce,$cordovaFileOpener2,$cordovaFileTransfer,$ionicPopup,$cordovaFile,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.currentYear = $filter('date')(new Date(),'yyyy');
	if($cordovaNetwork.isOffline())
    {
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
    }
	else
	{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/taxstatement",{params:{'acct_id':$rootScope.hsaaccId},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.      access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			$scope.tax_statement_list = data.tax_statement_list;

		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'Session expired, Please Login Again'
					});

					alertPopup.then(function(res) {
						localStorage.clear();
						$location.path("/login");
					});
			}else{
					$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
					.then(function(buttonIndex) {
						if(buttonIndex=="1")
						{
							localStorage.clear();
							$location.path("/login");
						}
					});
					return false;
			}
		});
    }
	
	$scope.form1099=function(){
		if($rootScope.IOS==true){
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'1099',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "1099.pdf";
				var contentFile = blob;
				$cordovaFile.writeFile(cordova.file.dataDirectory, fileName,contentFile, true)
				.then(function (success) {
					//alert("writeFile"+JSON.stringify(success));
					$cordovaFileOpener2.open(cordova.file.dataDirectory+fileName,'application/pdf')
					.then(function(){
						//alert("open")
					},function(err){
						//alert("Error");
						//alert(JSON.stringify(err));
					})
					$scope.activity={};
				}, function (error){	
					// alert("error")
				});
			}).error(function(data){});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'1099',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "1099.pdf";
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}
	
	$scope.form5498=function(){
		if($rootScope.IOS==true){
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'5498',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "5498.pdf";
				var contentFile = blob;
				$cordovaFile.writeFile(cordova.file.dataDirectory, fileName,contentFile, true)
				.then(function (success) {
					//alert("writeFile"+JSON.stringify(success));
					$cordovaFileOpener2.open(cordova.file.dataDirectory+fileName,'application/pdf')
					.then(function(){
						//alert("open")
					},function(err){
						//alert("Error");
						//alert(JSON.stringify(err));
					})
					$scope.activity={};
				}, function (error){	
					// alert("error")
				});
			}).error(function(data){});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'5498',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "5498.pdf";
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}

	$scope.goback=function()
	{
		$rootScope.hidecontent=true;
		$location.path("app/hsa");
	}
})
.controller('HsastatementCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.date=$scope.activity;
	$scope.summary= $rootScope.summary_list;
	$scope.activity_list=$rootScope.activity_list;

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("/activitystmnt")
	}

})
.controller('activityContributionyCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$location.path("activity");
	}
	
})
.controller('DisbursementCtrl', function($rootScope,$scope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.goback=function()
	{
		$location.path("activity");
	}
	
})
.controller('ScheduledcontributeCtrl', function($scope,$ionicHistory,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.hsaaccno=$rootScope.hsaaccno;
	
	var timer=$timeout(function(){
		//alert("Your request time out");
		$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
			// success
			$ionicLoading.hide();
		}, function (error) {
		// error
		});
	},30000)
			
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/schedule",{params:{'acc_num':$scope.hsaaccno,'trans_type':'c'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		$timeout.cancel(timer);
		if(data.schedule_list==null || data.schedule_list==""){
			if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'There are no Scheduled contribution'
					});

					alertPopup.then(function(res) {
						$location.path("/activityContribution");
					});
			}else{
				$cordovaDialogs.confirm('There are no Scheduled contribution', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path("/activityContribution");
						$ionicViewService
					}
				});
			}
		}else{
			$scope.schedule_list=data.schedule_list;
		}
	}).error(function(err){
		$ionicLoading.hide();
		$timeout.cancel(timer);
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	});
 
	$scope.goback=function()
	{
		$location.path("/activityContribution")
	}
})

//FSA Starts//
.controller('FsaCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$ionicTabsDelegate,$ionicSideMenuDelegate,$ionicPopup,$timeout,$cordovaToast) {
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json;  charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		localStorage.setItem('account_types',data.account_types.FSA);
		$rootScope.acctype=data.account_types;
		$scope.account_types=data.account_types.FSA;
		$rootScope.fsaaccno=data.account_types.FSA.ACCT_NUM;
		$rootScope.fsaaccId=data.account_types.FSA.ACCT_ID;
		
		$http.get(' http://app.sterlinghsa.com/api/v1/accounts/list',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			for(var i=0;i<data.accounts.length;i++){
				if($rootScope.fsaaccno==data.accounts[i].ACC_NUM){
					$rootScope.fsaaccno=data.accounts[i].ACC_NUM;
					$rootScope.fsaaccId=data.accounts[i].ACC_ID;
					$rootScope.fsaaccbalance=data.accounts[i].ACCT_BALANCE;
				}
			}
		}).error(function(err){

		});
		
		$scope.debit();
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
		}else{
			
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	});
	$scope.debit=function(){
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
				$scope.debit_card_list=data.debit_card_list[0];
				$rootScope.fsa_debit_card_transNo = $scope.debit_card_list.TRANSACTION_NUMBER;
				$rootScope.fsa_debit_card_amount = $scope.debit_card_list.AMOUNT;
		}).error(function(err){
			$ionicLoading.hide();
		});
	}
	
	$scope.goBack = function () {
		var selected = $ionicTabsDelegate.selectedIndex();
		if (selected != -1 && selected != 0) {
			$ionicTabsDelegate.select(selected - 1);
		}
	}
	$scope.goforward=function(){
		if($scope.acctype.HRA==null)
		{	   							 
			$location.path('/app/cobra');				  
		}
		else
		{
			$location.path('/app/hra');  
		}
	}
})
.controller('ContributionCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}
})
.controller('MakeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("/app/hsa");
	}
	
})
.controller('ActivityCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	}else{
		$http.get('  http://app.sterlinghsa.com/api/v1/accounts/categories',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hsa");
	}
	
})
.controller('RecentCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	}else{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.hsaaccId,'trans_type':'c','plan_type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if(data.transcation_list==null || data.transcation_list==""){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'There are no Recent Contribution'
					});

					alertPopup.then(function(res) {
						$location.path('/activityContribution');
					});
				}else{
					$cordovaDialogs.confirm('There are no Recent Contribution', 'Sorry', 'ok')
						.then(function(buttonIndex) {
							if(buttonIndex=="1")
							{
								$location.path('/activityContribution');
							}
						}); 
				}
			
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("/activityContribution")
	}
	
})
.controller('RecentdisburseCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicPopup,$ionicLoading,$cordovaNetwork,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
	$ionicLoading.hide();
	if($rootScope.IOS==true){
		var alertPopup = $ionicPopup.alert({
			title: 'Sorry',
			template: 'Session expired, Please Login Again'
		});

		alertPopup.then(function(res) {
			localStorage.clear();
			$location.path("/login");
		});
	}else{
		$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
		.then(function(buttonIndex) {
			if(buttonIndex=="1")
			{
				localStorage.clear();
				$location.path("/login");
			}
		});
		return false;
	}
	}else{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.hsaaccId,'trans_type':'d','plan_type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if(data.transcation_list==null || data.transcation_list==""){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'There are no Recent Disbursement'
					});

					alertPopup.then(function(res) {
						$location.path('/disbursement');
					});
				}else{
					$cordovaDialogs.confirm('There are no Recent Disbursement', 'Sorry', 'ok')
					.then(function(buttonIndex) {
						if(buttonIndex=="1")
						{
							$location.path('/disbursement');
						}
				}); 
			}
				
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}
		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("/disbursement")
	}
	
})
.controller('ScheduledDisbursementCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	
	var timer=$timeout(function(){
		//alert("Your request time out");
		$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
			// success
			$ionicLoading.hide();
		}, function (error) {
		// error
		});
	},30000)
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/schedule",{params:{'acct_id':$scope.hsaaccId,'trans_type':'d'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){ 
		$ionicLoading.hide();
		$timeout.cancel(timer);
		if(data.schedule_list==null || data.schedule_list==""){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There are no Scheduled Disbursement'
				});

				alertPopup.then(function(res) {
					$location.path('/disbursement');
				});
			}else{
				$cordovaDialogs.confirm('There are no Scheduled Disbursement', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					$location.path('/disbursement');
				}
			}); 
			}
			
		}
		else{
			$scope.schedule_list=data.schedule_list;
		}

	}).error(function(err){
		$ionicLoading.hide();
		$timeout.cancel(timer);
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}

	});

	$scope.goback=function()
	{
		$location.path("/disbursement")
	}
})
.controller('lastdisbursementCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.fsaaccId,'trans_type':'d','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if(data.transcation_list==null || data.transcation_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There are no Recent Disbursement'
				});

				alertPopup.then(function(res) {
					$location.path('/fsacontribution');
				});
			}else{
				$cordovaDialogs.confirm('There are no Recent Disbursement', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacontribution');
					}
				}); 
			}
				
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})
.controller('lastcontributionCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.fsaaccId,'trans_type':'c','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if(data.transcation_list==null || data.transcation_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There are no Recent Contribution'
				});

				alertPopup.then(function(res) {
					$location.path('/fsacontribution');
				});
			}else{
				$cordovaDialogs.confirm('There are no Recent Contribution', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacontribution');
					}
				}); 
			}
				
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})
.controller('fsacontributionCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
	
})
.controller('InformationCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.acc=$rootScope.fsaaccno;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
			});
		}else{
			$cordovaDialogs.alert('Please Connect with internet', 'Sorry', 'ok')
			.then(function() {
			});
			return false;
		}
	}else{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/accountinfo",{params:{'type':'fsa','acc_num':$scope.acc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){ 
			$scope.accnumber=data.account_information;
		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	 
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa");
	}

})
.controller('AvailablebalanceCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.fsaccno=$rootScope.fsaaccno;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Please Connect with internet', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.fsaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			$rootScope.available_balances = data.available_balances;
		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
})
.controller('newclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.fsaaccno=$rootScope.fsaaccno;
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.plan_types=$rootScope.plan_types;
	$scope.newclaim_plantype=$rootScope.newclaim_plantype;
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	$scope.myAvlBalance=function(){
		if($scope.newclaim_balance < 0){
			$scope.newclaimvalues.amount='';
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have sufficient balance to this claim'
				});

				alertPopup.then(function(res) {
					//window.history.back();
				});
			}else{
				$cordovaDialogs.alert('You do not have sufficient balance to this claim','Sorry','OK')
				.then(function() {
					//window.history.back();
				});
			}
		}
	}
	
	$scope.newclaimvalues={taxid:'',amount:'',dependent:'',patient:'',Bankaccount:'',startTransDate:'',endTransDate:''};
	$scope.imgSrc;
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{
		$scope.floatlabel=true; 
	}

	$scope.goback=function()
	{
		$scope.plan_types={};
		$location.path("new");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						 $scope.imgSrc=imageData;
						 $scope.imgCheck=imageData;
						 $scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
	
	if($rootScope.claimMode='payme'){
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'fsa', 'acc_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$scope.bank_details=data.bank_details;
			//alert("claimMode")
			//alert($rootScope.claimMode)
			if(data.status=="FAILED"){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});   
	}else if($rootScope.claimMode='payprovider'){
		$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num': $scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			$scope.payee=data.payee;
			if(data.payee==null){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have any payee on record. You must add a payee account by www.SterlingAdministration.com to schedule new claim request for payee.'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have any payee on record. You must add a payee account by www.SterlingAdministration.com to schedule new claim request for payee.','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
		}).error(function(err){

		});
	}
	
	
	if($rootScope.planCode=='DCA'){
		$scope.getTransDate=function(){
			var options = {
				date: new Date(),
				mode: 'date', // or 'time'
			}
			
			$cordovaDatePicker.show(options).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.startTransDate=selectedDate;

			});
		};
		$scope.EndgetTransDate=function(){
			var options = {
				date: new Date(),
				mode: 'date', // or 'time'
			}

			$cordovaDatePicker.show(options).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.endTransDate=selectedDate;

			});
		};
	}else{
		$scope.getTransDate=function(){
			var today = new Date();
			var _minDate = new Date();
			_minDate.setMonth(today.getMonth() -1000);
			var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
			(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
			var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

			$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.startTransDate=selectedDate;

			});
		};
		$scope.EndgetTransDate=function(){
			var today = new Date();
			var _minDate = new Date();
			_minDate.setMonth(today.getMonth() -1000);
			var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
			(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
			var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

			$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.endTransDate=selectedDate;

			});
		};
	}
	
	$scope.newclaimsubmit=function(myForm){
		if($rootScope.planCode=='TRN' || $rootScope.planCode=='PKG'){
			$scope.imgCheck='';
		}
		if($scope.newclaimvalues.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}
		else if(new Date($scope.newclaimvalues.startTransDate) > new Date($scope.newclaimvalues.endTransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'End Date should not be less than start Date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('End Date should not be less than start Date')
				.then(function() {
				});
			}
		}
		else if(new Date($scope.newclaimvalues.endTransDate) <= $scope.date){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Cannot select future date in End date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Cannot select future date in End date')
				.then(function() {
				});
			}

		}else if($scope.imgCheck==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.newclaimvalues={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num':  $scope.fsaaccno,
			'acct_id':$scope.fsaaccId,
			'bank_acct_id':$scope.newclaimvalues.Bankaccount.BANK_ACC_ID,
			'amount':$scope.newclaimvalues.amount,
			'service_start_date':$scope.newclaimvalues.startTransDate,
			'service_end_date':$scope.newclaimvalues.endTransDate,
			'patient_name':$scope.newclaimvalues.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':'',
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.newclaimvalues.description,
			'note':'Mobile',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'
			},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$scope.claim_id = data.claim_id;
				$location.path("/new");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Claim Submitted Successfully',
						template: 'Claim number is'+ " " + $scope.claim_id
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$location.path("/new");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;	
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;		    
					});
					return false;
				}	
				
			}

			}).error(function(err){
			});
		}

	}
})
.controller('RecentdisCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}
})
.controller('RecentcontributeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}
})

.controller('NewCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.fsaccno=$rootScope.fsaaccno;
	$rootScope.claimMode='';
	$rootScope.claimMode='payme';
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.fsaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})

	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.fsaaccId},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/fsa');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/fsa');
				});
			}
		}else{
			$scope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
 
	$scope.plan_type={};
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
				$rootScope.newclaim_plantype=$scope.available_balances[i].PLAN_DESC;
			}
		}
		if(claim.LOOKUP_CODE === 'DCA'){
			$rootScope.patientname=false;
			$rootScope.dependentName=true;
			$rootScope.taxcontent=true;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'TRN'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'LPF'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'HRA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'HRP'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'PKG'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'UA1'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'ACO'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'HR4'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'HR5'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.LOOKUP_CODE === 'HSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}
		$scope.plan_type={};

	}

	$scope.goback=function()
	{
		$location.path("app/fsa");
	}
})
.controller('FsapaymeCtrl', function($scope,$ionicPopup, $timeout ,$ionicModal,$location, $ionicHistory,$ionicSideMenuDelegate, $cordovaDialogs,$timeout,$cordovaToast) {
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
})
.controller('fsapayproviderCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.fsaccno=$rootScope.fsaaccno;
	$rootScope.claimMode='';
	$rootScope.claimMode='payprovider';
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.fsaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})

	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.fsaaccId},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/fsa');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/fsa');
				});
			}
		}else{
			$rootScope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
  
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
				$rootScope.newclaim_plantype=$scope.available_balances[i].PLAN_DESC;
			}
		}
		
		if(claim.LOOKUP_CODE === 'DCA'){
			$rootScope.patientname=false;
			$rootScope.dependentName=true;
			$rootScope.taxcontent=true;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'TRN'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'LPF'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'HRA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'HRP'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'PKG'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'UA1'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'ACO'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'HR4'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'HR5'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.LOOKUP_CODE === 'HSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}
	}
	
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa");
	}
})
.controller('fsadependentCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
    $scope.hsaaccno=$rootScope.hsaaccno;
	$scope.fsaaccno=$rootScope.fsaaccno;
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.plan_types=$rootScope.plan_types;
	$scope.newclaim_plantype=$rootScope.newclaim_plantype;
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	$scope.myAvlBalance=function(){
		if($scope.newclaim_balance < 0){
			$scope.newclaimvalues.amount='';
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have sufficient balance to this claim'
				});

				alertPopup.then(function(res) {
					//window.history.back();
				});
			}else{
				$cordovaDialogs.alert('You do not have sufficient balance to this claim','Sorry','OK')
				.then(function() {
					//window.history.back();
				});
			}
		}
	}
	
    $scope.newclaimvalues={taxid:'',amount:'',dependent:'',patient:'',Bankaccount:'',startTransDate:'',endTransDate:''};
	$scope.imgSrc;
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	 $ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	
	$scope.goback=function()
	{
		$location.path("fsapayprovider");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});	
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.imgCheck=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}	
	}
	
	$scope.newclaimFsa=function(){
		if($rootScope.planCode=='TRN' || $rootScope.planCode=='PKG'){
			$scope.imgCheck='';
		}
		if($scope.newclaimvalues.amount == 0){
			$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
			.then(function() {
			});
		}
		else if(new Date($scope.newclaimvalues.startTransDate) > new Date($scope.newclaimvalues.endTransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'End Date should not be less than start Date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('End Date should not be less than start Date')
				.then(function() {
				});
			}
		}
		else if(new Date($scope.newclaimvalues.endTransDate) <= $scope.date){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Cannot select future date in End date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Cannot select future date in End date')
				.then(function() {
				});
			}

		}else if($scope.imgCheck==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});

			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.newclaimvalues={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num':  $scope.fsaaccno,
			'acct_id':$scope.fsaaccId,
			'bank_acct_id':'',
			'amount':$scope.newclaimvalues.amount,
			'service_start_date':$scope.newclaimvalues.startTransDate,
			'service_end_date':$scope.newclaimvalues.endTransDate,
			'patient_name':$scope.newclaimvalues.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':$scope.newclaimvalues.selectpayee.VENDOR_ID,
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.newclaimvalues.description,
			'note':'Mobile',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$scope.claim_id = data.claim_id;
				$location.path("/fsapayprovider");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Claim Submitted Successfully',
						template: 'Claim number is'+ " " + $scope.claim_id
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$location.path("/fsapayprovider");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
					return false;
				}	
			}
			}).error(function(err){
			})
		}
	}
    
   
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num': $scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.payee=data.payee ;
		if($rootScope.claimMode='payprovider'){
			if(data.payee==null){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have any payee on record. You must add a payee account by www.SterlingAdministration.com to schedule new claim request for payee.'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have any payee on record. You must add a payee account by www.SterlingAdministration.com to schedule new claim request for payee.','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
		}
	}).error(function(err){
	});
	
	if($rootScope.planCode=='DCA'){
		$scope.getTransDate=function(){
			var today = new Date();
			var _minDate = new Date();
			_minDate.setMonth(today.getMonth() -1000);
			var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
			(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
			var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

			$cordovaDatePicker.show({date: today}).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.startTransDate=selectedDate;

			});
		};
		$scope.EndgetTransDate=function(){
			var today = new Date();
			var _minDate = new Date();
			_minDate.setMonth(today.getMonth() -1000);
			var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
			(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
			var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

			$cordovaDatePicker.show({date: today}).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.endTransDate=selectedDate;

			});
		};
	}else{
		$scope.getTransDate=function(){
			var today = new Date();
			var _minDate = new Date();
			_minDate.setMonth(today.getMonth() -1000);
			var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
			(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
			var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

			$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.startTransDate=selectedDate;

			});
		};
		$scope.EndgetTransDate=function(){
			var today = new Date();
			var _minDate = new Date();
			_minDate.setMonth(today.getMonth() -1000);
			var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
			(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
			var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

			$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
			(function(date)
			{
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.newclaimvalues.endTransDate=selectedDate;

			});
		};
	}
	
})

.controller('HealthCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hsa");
	}
})

.controller('fsacardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
	
})

.controller('fsacarddetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccno=$rootScope.fsaaccno;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{ 
		//$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			// if(data.debit_card_list==null || data.debit_card_list==""){
			if(data.claim_detail_list==null || data.claim_detail_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'The desired information for your debit card purchase is unavailable at this moment.'
				});

				alertPopup.then(function(res) {
					$location.path('app/fsa');
				});
			}else{
				$cordovaDialogs.confirm('The desired information for your debit card purchase is unavailable at this moment.', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/fsa');
					}
				}); 
			}
				
			}
			else{
				// $scope.debit_card_list=data.debit_card_list;
				$scope.claim_detail_list=data.claim_detail_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})

.controller('fsaclaimviewCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccno=$rootScope.fsaaccno;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{ 
		//$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			// if(data.debit_card_list==null || data.debit_card_list==""){
			if(data.claim_detail_list==null || data.claim_detail_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have any unsubstantiated claim at this time.'
				});

				alertPopup.then(function(res) {
					$location.path('app/fsa');
				});
			}else{
				$cordovaDialogs.confirm('You do not have any unsubstantiated claim at this time.', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/fsa');
					}
				}); 
			}
				
			}
			else{
				//$scope.debit_card_list=data.debit_card_list;
				$scope.claim_detail_list=data.claim_detail_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.getClaimDetail=function(data){
		//localStorage.setItem('claimData',data)
		$rootScope.claimData=data;
		$location.path("/fsaclaimdetail");
	}
	
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
	
})

.controller('fsaclaimdetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.claimData=$rootScope.claimData;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'trans_num':$scope.claimData.CLAIM_ID},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.payment_information==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No Claim Detail'
				});

				alertPopup.then(function(res) {
					$location.path('/fsacardclaim');
				});
			}else{
				$cordovaDialogs.confirm('No Claim Detail', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacardclaim');
					}
				}); 
			}
				
			}
			else{
				$scope.payment_information=data.payment_information[0];
				$scope.docs_list=data.docs_list;
				//alert("payment_information-"+JSON.stringify($scope.payment_information))
				//alert("docs_list-"+JSON.stringify($scope.docs_list))
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	
	$scope.getDocument=function(doc){
		//alert(doc.ATTACHMENT_ID)
		if($rootScope.IOS==true){
			//alert("Http")
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				//alert(data);
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				$cordovaFile.writeFile(cordova.file.dataDirectory, fileName,contentFile, true)
				.then(function (success) {
					//alert("writeFile"+JSON.stringify(success));
					$cordovaFileOpener2.open(cordova.file.dataDirectory+fileName,'application/pdf')
					.then(function(){
						//alert("open")
					},function(err){
						//alert("Error");
						//alert(JSON.stringify(err));
					})
					$scope.activity={};
				}, function (error){	
					// alert("error")
				});
			}).error(function(data){
				//alert("http Error");
				//alert(data);
			});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration/Claim Docs", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'image/png')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}
	
	$scope.goback=function()
	{
		$location.path("/fsaclaimview")
	}
	
})

.controller('fsanewcardclaimviewCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccno=$rootScope.fsaaccno;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{ 
		//$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'acct_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			// if(data.debit_card_list==null || data.debit_card_list==""){
			if(data.claim_detail_list==null || data.claim_detail_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have any unsubstantiated claim at this time.'
				});

				alertPopup.then(function(res) {
					$location.path('app/fsa');
				});
			}else{
				$cordovaDialogs.confirm('You do not have any unsubstantiated claim at this time.', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/fsa');
					}
				}); 
			}
				
			}
			else{
				// $scope.debit_card_list=data.debit_card_list;
				$scope.claim_detail_list=data.claim_detail_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.getClaimDetail=function(data){
		//localStorage.setItem('claimData',data)
		$rootScope.claimData=data;
		$location.path("/fsanewcardclaim");
	}
	
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
	
})

.controller('fsanewcardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.trans_num=$rootScope.claimData.CLAIM_ID;
	$scope.debit_card_amount = $rootScope.claimData.CLAIM_AMOUNT;
	$scope.imgSrc;
	$scope.floatlabel=false;
	$scope.claimData=$rootScope.claimData;
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}

	$scope.goback=function()
	{
		$scope.plan_types={};
		$location.path("/fsanewcardclaimview");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						 $scope.imgSrc=imageData;
						 $scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
	   
	$scope.newclaimsubmit=function(){
		if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else if($scope.trans_num==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: "You Can't upload any receipt"
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert("You Can't upload any receipt")
				.then(function() {
				});
			}
		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.imgSrc= '';
					var myEl = angular.element( document.querySelector( '#receipt' ) );
					myEl.removeAttr('src');					
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/uploadclaimdocument",{'claim_id':  $scope.trans_num,
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'
			},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$scope.claim_id = data.claim_id;
				$location.path("/fsacardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Success',
						template: 'Claim Submitted Successfully'
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim Submitted Successfully', 'Success', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$location.path("/fsacardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;	
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;		    
					});
					return false;
				}	
				
			}

			}).error(function(err){
			});
		}

	}
})

// Other Controllers
.controller('AppCtrl', function($scope,$ionicPopup, $ionicHistory,$timeout ,$ionicModal,$location,$cordovaDialogs, $rootScope,$http) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$rootScope.acctype=data.account_types;
		$scope.acctype=data.account_types;
		if($rootScope.acctype==null || $rootScope.acctype==""){
			//$location.path("app/noplan")
			//alert("No active plans");
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'The benefit plans are not active at the moment, for details contact customer care'
				});

				alertPopup.then(function(res) {
					//localStorage.clear();
					//$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('The benefit plans are not active at the moment, for details contact customer care', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						//localStorage.clear();
						//$location.path("/login");
					}
				});
				return false;
			}
		}else{
			if($scope.acctype.HSA!=null)
			{
				$scope.hidehsa=true; 
				$scope.showHsamenu=true;
				// $location.path('/app/hsa');
				// $scope.homePath="#/app/hsa";
			}
			if($scope.acctype.FSA!=null){
				$scope.hidefsa=true;
				$scope.showFsamenu=true;
				// $location.path('/app/fsa');
				// $scope.homePath="#/app/fsa";
			}
			if($scope.acctype.COBRA!=null){
				$scope.hidecobra=true;
				$scope.showCobramenu=true;							 
				// $location.path('/app/cobra');
				// $scope.homePath="#/app/cobra";
			}
			if($scope.acctype.HRA!=null){
				$scope.hidehra=true;
				$scope.showHramenu=true;	
				// $location.path('/app/hra');
				// $scope.homePath="#/app/hra";
			}
			
			if($scope.acctype.HSA!=null || $scope.acctype.HSA!=undefined){
				$location.path('/app/hsa');
				$scope.homePath="#/app/hsa";
				localStorage.setItem('hsaPath','/app/hsa');
			}else if($scope.acctype.FSA!=null || $scope.acctype.FSA!=undefined){
				$location.path('/app/fsa');
				$scope.homePath="#/app/fsa";
				localStorage.setItem('fsaPath','/app/fsa');
			}else if($scope.acctype.HRA!=null || $scope.acctype.HRA!=undefined){
				$location.path('/app/hra');
				$scope.homePath="#/app/hra";
				localStorage.setItem('hraPath','/app/hra');
			}else if($scope.acctype.COBRA!=null || $scope.acctype.COBRA!=undefined){
				$location.path('/app/cobra');
				$scope.homePath="#/app/cobra";
				localStorage.setItem('cobraPath','/app/cobra');
			}
		}
		
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	});
	
	$scope.hidefsa=false;
	$scope.hidehsa=false;
	$scope.hidecobra=false;
	$scope.hidehra=false;
	$scope.showCobramenu=false;
	$scope.showHramenu=false;
	$scope.showFsamenu=false;
	$scope.showHsamenu=false;
  
	$scope.exiqt = function() {

		var confirmPopup = $ionicPopup.confirm({
			title: 'Do you want to close',

			template: 'Are you sure',
			buttons : [{
				text : 'yes',
				type : 'button-positive button-outline',
			}, {
				text : 'No',
				type : 'button-positive button-outline',

			}]
		});

		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
			} else {
				console.log('You are not sure');
			}
		});
	};
  
	$scope.exit=function()
	{
		$location.path("/login");	
	}
  
	$scope.toggleSomething = function(){
		$scope.isVisible = !$scope.isVisible;
		$scope.isVisible1=false;
		$scope.isHra=false;
		$scope.isCobra=false;
		console.log('make sure toggleSomething() is firing*');
	}

	$scope.toggleSomething1 = function(){
		$scope.isVisible1 = !$scope.isVisible1;
		$scope.isVisible=false;
		$scope.isHra=false;
		$scope.isCobra=false;
		console.log('make sure toggleSomething() is firing*');
	}
	$scope.toggleHra = function(){
		$scope.isHra = !$scope.isHra;
		$scope.isVisible=false;
		$scope.isVisible1=false;
		$scope.isCobra=false;
		console.log('make sure toggleSomething() is firing*');
	}
	$scope.toggleCobra = function(){
		$scope.isCobra = !$scope.isCobra;
		$scope.isVisible=false;
		$scope.isVisible1=false;
		$scope.isHra=false;
		console.log('make sure toggleSomething() is firing*');
	}
	
	$scope.contactPage=function(){
		$location.path("/contact");
	}

	$scope.logOut=function()
	{
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Do you want to Logout',
				template: 'Are you sure',
				okText: 'No',
				cancelText: 'Yes',
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('You are not sure');
				} else {
					$timeout(function () {
					  $ionicHistory.clearCache();
					  $ionicHistory.clearHistory();
					  $log.debug('clearing cache')
				  },300)
					localStorage.clear();
					$location.path("/login");
					$http.get('http://app.sterlinghsa.com/api/v1/user/logout',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
					.success(function(data){});
				}
			});
		}else{
			$cordovaDialogs.confirm('Do you want to Logout', 'Are you sure', ['Yes','No'])
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					$timeout(function () {
					  $ionicHistory.clearCache();
					  $ionicHistory.clearHistory();
					  $log.debug('clearing cache');
				  },300) 
					localStorage.clear();
					$location.path("/login");
					$http.get('http://app.sterlinghsa.com/api/v1/user/logout',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
					.success(function(data){});
				}
				else{}
			});
		}
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}

	$scope.show1 = false;
	$scope.show2 = false;
	$scope.click1 = function($event) { 
		$event.stopPropagation();
		$scope.show1 = !$scope.show1;
		$scope.show2 = false;
		$ionicListDelegate.closeOptionButtons(); 
	}
	
	$scope.hideAll = function() 
	{ 
		$scope.show2 = false;
		$scope.show1 = false;
		$scope.isVisible1=false;
		$scope.isVisible=false;
		$scope.isHra=false;
		$scope.isCobra=false;
		$ionicListDelegate.closeOptionButtons(); 
	}

})
.controller('HeaderCtrl', function($scope,$ionicPopup, $timeout ,$ionicModal,$location, $ionicHistory, $cordovaDialogs) {
	// $scope.logOut=function()
	// {
		// if($rootScope.IOS==true){
				// var confirmPopup = $ionicPopup.confirm({
				// title: 'Do you want to Logout',
				// template: 'Are you sure',
				// okText: 'No',
				// cancelText: 'Yes',
			// });
			// confirmPopup.then(function(res) {
				// if(res) {
					// console.log('You are not sure');
				// } else {
					// localStorage.clear();
					// $location.path("/login");
				// }
			// });
		// }else{
			// $cordovaDialogs.confirm('Do you want to Logout', 'Are you sure', ['Yes','No'])
			// .then(function(buttonIndex) {
				// if(buttonIndex=="1")
				// {
				// localStorage.clear();
				// $location.path("/login");
				// }
				// else{}
			// });
		// }
	// }
	$scope.goBack = function()
	{
		if (localStorage.getItem("backCount")==1) {
			localStorage.setItem("backCount","0")
			$cordovaDialogs.confirm('Are You Sure', 'Do you Want to Close ', ['Yes','No'])
			.then(function(buttonIndex) {
				if (buttonIndex=='1') {
					ionic.Platform.exitApp();
				}
			});
		}else if(localStorage.getItem("backCount")==0){
			$cordovaDialogs.confirm('Are You Sure', 'Do you Want to Close ', ['Yes','No'])
			.then(function(buttonIndex) {
				if (buttonIndex=='1') {
					ionic.Platform.exitApp();
				}
			});
		}
		else if (localStorage.getItem("backCount")>1) 
		{
			var backcount=parseInt(localStorage.getItem("backCount"));
			var backcount=backcount-1;
			localStorage.setItem("backCount",backcount);
			window.history.back();
		}
	};
})

.controller('contactCtrl', function($scope,$location,$rootScope, $stateParams, $http) {
	localStorage.setItem("backCount","2");
	$rootScope.hidecontent=true;

	$scope.backcontrol=function()
	{
		$location.path("/app/hsa")
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("/app/hsa")
	}
})


// HRA contoller
.controller('HraCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$rootScope.hraaccno=data.account_types.HRA.ACCT_NUM; 
		$rootScope.hraaccId=data.account_types.HRA.ACCT_ID;
		
		$http.get(' http://app.sterlinghsa.com/api/v1/accounts/list',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
			for(var i=0;i<data.accounts.length;i++){
				if($rootScope.hraaccno==data.accounts[i].ACC_NUM){
					$rootScope.hraaccno=data.accounts[i].ACC_NUM;
					$rootScope.hraaccId=data.accounts[i].ACC_ID;
					$rootScope.hraaccbalance=data.accounts[i].ACCT_BALANCE;
				}
			}
		}).error(function(err){

		});
		
		$scope.debit();
	}).error(function(err){

	});

	$scope.debit=function(){
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
				$scope.hra_debit_card_list=data.debit_card_list[0];
				$rootScope.hra_debit_card_transNo = $scope.debit_card_list.TRANSACTION_NUMBER;
				$rootScope.hra_debit_card_amount = $scope.debit_card_list.AMOUNT;
		}).error(function(err){
			$ionicLoading.hide();
		});
	}
	
	$scope.goBack=function(){
		$location.path("app/fsa");
	}
	
	$scope.goforward=function(){
		$location.path("app/cobra");
	}
})
.controller('HraacctCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraacc= $rootScope.hraaccno;
	$scope.hraaccId= $rootScope.hraaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Please Connect with internet', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}
	else
	{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/accountinfo",{params:{'type':'hra','acc_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			$scope.accnumber=data.account_information;
		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HracontributionCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}
	else
	{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id': $scope.hraid,'trans_type':'c','plan_type':'hra'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if(data.transcation_list==null || data.transcation_list==""){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'There are no Recent Contribution'
					});

					alertPopup.then(function(res) {
						$location.path('/hracontribution');
					});
				}else{
					$cordovaDialogs.confirm('There are no Recent Contribution', 'Sorry', 'ok')
						.then(function(buttonIndex) {
							if(buttonIndex=="1")
							{
								$location.path('/hracontribution');
							}
						}); 
				}
			}
			else{
			$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
	
	
})
.controller('HradisburseCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}
	else
	{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.hraid,'trans_type':'d','plan_type':'hra'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if(data.transcation_list==null || data.transcation_list=="")
			{
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'There are no Recent Disbursement'
					});

					alertPopup.then(function(res) {
						$location.path('/hracontribution');
					});
				}else{
					$cordovaDialogs.confirm('There are no Recent Disbursement', 'Sorry', 'ok')
						.then(function(buttonIndex) {
							if(buttonIndex=="1")
							{
								$location.path('/hracontribution');
							}
						}); 
				}
			}
			else
			{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'Session expired, Please Login Again'
					});

					alertPopup.then(function(res) {
						localStorage.clear();
						$location.path("/login");
					});
				}else{
					$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
					.then(function(buttonIndex) {
						if(buttonIndex=="1")
						{
							localStorage.clear();
							$location.path("/login");
						}
					});
					return false;
				}
		});
	}

	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HranewclaimCtrl', function($scope,$location,$rootScope, $stateParams, $http,$timeout,$cordovaToast) {
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HrarecentCtrl', function($scope,$location,$rootScope, $stateParams, $http,$timeout,$cordovaToast) {
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HrapaymeCtrl', function($scope,$location,$rootScope,$ionicPopup,$cordovaDialogs,$stateParams, $http,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;
	$scope.hraacc= $rootScope.hraaccno;
	$scope.hraaccId= $rootScope.hraaccId;
	$rootScope.claimMode='';
	$rootScope.claimMode='payme';
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.hraid},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/hra');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/hra');
				});
			}
		}else{
			$scope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
			}
		}
		/*
		if(claim.MEANING === 'HR4INDE'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAFirmenich'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAApportable'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAOHIOCHRIST'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAJNOLAN'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRACAREAL'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}*/
		$location.path("/paymeacoinde");
		$rootScope.planCode=claim.LOOKUP_CODE;
	}
	
	$scope.goback=function()
	{
		$location.path("/hranewclaim");
	}
})
.controller('HrapayproviderCtrl', function($scope,$location,$rootScope,$ionicPopup,$cordovaDialogs,$stateParams, $http,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;
	$scope.hraacc= $rootScope.hraaccno;
	$scope.hraaccId= $rootScope.hraaccId;
	$rootScope.claimMode='';
	$rootScope.claimMode='payprovider';
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.hraid},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/hra');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/hra');
				});
			}
		}else{
			$scope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
  
	$scope.plan_type="";
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
			}
		}
		/*if(claim.MEANING === 'HR4INDE'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAFirmenich'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAApportable'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAOHIOCHRIST'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAJNOLAN'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRACAREAL'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}*/
		$location.path("/payprovideracoinde");
		$rootScope.planCode=claim.LOOKUP_CODE;
	}
	$scope.goback=function()
	{
		$location.path("/hranewclaim");
	}
	
})
.controller('HrabalCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraacc= $rootScope.hraaccno;
	$scope.hraaccId= $rootScope.hraaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Please Connect with internet', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			$rootScope.available_balances = data.available_balances;
		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('PaymeacoindeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$cordovaCamera,$ionicPopup,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	
	$scope.myAvlBalance=function(){
		if($scope.newclaim_balance < 0){
			$scope.acoinde.amount='';
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have sufficient balance to this claim'
				});

				alertPopup.then(function(res) {
					//window.history.back();
				});
			}else{
				$cordovaDialogs.alert('You do not have sufficient balance to this claim','Sorry','OK')
				.then(function() {
					//window.history.back();
				});
			}
		}
	}
	
	$scope.hraacc= $rootScope.hraaccno;
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.hraaccId= $rootScope.hraaccId;
	$scope.acoinde = {selectAccount:'',amount:'',description:'',startTransDate:'',endTransDate:'',patient:''};
	$scope.imgSrc;
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
		
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hra', 'acc_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if($rootScope.claimMode='payme'){
			if(data.status=="FAILED"){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have a bank account on record.You must add a bank account by logging into www.sterlingadministration.com to schedule disbursements','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
		}
		$scope.bank_details=data.bank_details;
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	});
 
	$scope.getTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.acoinde.startTransDate=selectedDate;

		});
	};
	$scope.EndgetTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.acoinde.endTransDate=selectedDate;

		});
	};
 
	$scope.submitValues=function(){
		if($scope.acoinde.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res){
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if(new Date($scope.acoinde.startTransDate) > new Date($scope.acoinde.endTransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'End Date should not be less than start Date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('End Date should not be less than start Date')
				.then(function() {
				});
			}
		}else if(new Date($scope.acoinde.endTransDate) < $scope.date){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Cannot select future date in End date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Cannot select future date in End date')
				.then(function() {
				});
			}

		}else if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.acoinde={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num':  $scope.hraaccno,
			'acct_id':$scope.hraaccId,
			'bank_acct_id':$scope.acoinde.selectAccount.BANK_ACC_ID,
			'amount':$scope.acoinde.amount,
			'service_start_date':$scope.acoinde.startTransDate,
			'service_end_date':$scope.acoinde.endTransDate,
			'patient_name':$scope.acoinde.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':'',
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.acoinde.description,
			'note':'Mobile',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					$scope.claim_id = data.claim_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Claim Submitted Successfully',
							template: 'Claim number is'+ " " + $scope.claim_id
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
						.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
						return false;
					}	
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function($setUntouched,$setPristine) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
						return false;
					}	
				}
			}).error(function(err){
			});
		}
	}
	$scope.goback=function()
	{
		$location.path("/hrapayme");
	}
	
})
.controller('PayprovideracoindeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$cordovaCamera,$ionicPopup,$timeout,$cordovaToast) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	$scope.hraaccno= $rootScope.hraaccno;
	$scope.hraaccId= $rootScope.hraaccId;
	
	$scope.myAvlBalance=function(){
		if($scope.newclaim_balance < 0){
			$scope.provideracoinde.amount='';
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have sufficient balance to this claim'
				});

				alertPopup.then(function(res) {
					//window.history.back();
				});
			}else{
				$cordovaDialogs.alert('You do not have sufficient balance to this claim','Sorry','OK')
				.then(function() {
					//window.history.back();
				});
			}
		}
	}
	$scope.provideracoinde={selectpayee:'',amount:'',description:'',startTransDate:'',endTransDate:'',patient:''};
	$scope.imgSrc;
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
		
	}
	
	$scope.submitValues=function(){
		if($scope.provideracoinde.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res){
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if(new Date($scope.provideracoinde.startTransDate) > new Date($scope.provideracoinde.endTransDate)){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'End Date should not be less than start Date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('End Date should not be less than start Date')
				.then(function() {
				});
			}
		}else if(new Date($scope.provideracoinde.endTransDate) < $scope.date){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Cannot select future date in End date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Cannot select future date in End date')
				.then(function() {
				});
			}

		}else if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.provideracoinde={};
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num': $scope.hraaccno,
			'acct_id':$scope.hraaccId,
			'bank_acct_id':'',
			'amount':$scope.provideracoinde.amount,
			'service_start_date':$scope.provideracoinde.startTransDate,
			'service_end_date':$scope.provideracoinde.endTransDate,
			'patient_name':$scope.provideracoinde.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':$scope.provideracoinde.selectpayee.VENDOR_ID,
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.provideracoinde.description,
			'note':'Mobile App',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					$scope.claim_id = data.claim_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Claim Submitted Successfully',
							template: 'Claim number is'+ " " + $scope.claim_id
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
						.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;
						});
						return false;
					}	
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					$timeout.cancel(timer);
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function($setUntouched,$setPristine) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;	    
						});
						return false;
					}	
				}
			}).error(function(err){
			});
		}
	}
 
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num': $scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.payee=data.payee ;
		if($rootScope.claimMode='payprovider'){
			if(data.payee==null){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'You do not have any payee on record. You must add a payee account by www.SterlingAdministration.com to schedule new claim request for payee.'
					});

					alertPopup.then(function(res) {
						window.history.back();
					});
				}else{
					$cordovaDialogs.alert('You do not have any payee on record. You must add a payee account by www.SterlingAdministration.com to schedule new claim request for payee.','Sorry','OK')
					.then(function() {
						window.history.back();
					});
				}
			}
		}
	}).error(function(err){
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	});
 
	$scope.getTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.provideracoinde.startTransDate=selectedDate;
		});
	};
	$scope.EndgetTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.provideracoinde.endTransDate=selectedDate;

		});
	};

	$scope.goback=function()
	{
		$location.path("/hrapayprovider");
	}

})


.controller('hracardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hra")
	}
	
})

.controller('hracarddetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraaccno=$rootScope.hraaccno;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		var timer=$timeout(function(){
			//alert("Your request time out");
			$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
				// success
				$ionicLoading.hide();
			}, function (error) {
			// error
			});
		},30000)
		// $http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			// if(data.debit_card_list==null || data.debit_card_list==""){
			if(data.claim_detail_list==null || data.claim_detail_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'The desired information for your debit card purchase is unavailable at this moment.'
				});

				alertPopup.then(function(res) {
					$location.path('app/hra');
				});
			}else{
				$cordovaDialogs.confirm('The desired information for your debit card purchase is unavailable at this moment.', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/hra');
					}
				}); 
			}
				
			}
			else{
				// $scope.debit_card_list=data.debit_card_list;
				$scope.claim_detail_list=data.claim_detail_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			$timeout.cancel(timer);
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
	
})

.controller('hraclaimviewCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraaccno=$rootScope.hraaccno;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{ 
		// $http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			// if(data.debit_card_list==null || data.debit_card_list==""){
			if(data.claim_detail_list==null || data.claim_detail_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have any unsubstantiated claim at this time.'
				});

				alertPopup.then(function(res) {
					$location.path('app/hra');
				});
			}else{
				$cordovaDialogs.confirm('You do not have any unsubstantiated claim at this time.', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/hra');
					}
				}); 
			}
				
			}
			else{
				// $scope.debit_card_list=data.debit_card_list;
				$scope.claim_detail_list=data.claim_detail_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.getClaimDetail=function(data){
		//localStorage.setItem('claimData',data)
		$rootScope.claimData=data;
		$location.path("/hraclaimdetail");
	}
	
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hra")
	}
	
})

.controller('hranewcardclaimviewCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraaccno=$rootScope.hraaccno;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{ 
		// $http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			// if(data.debit_card_list==null || data.debit_card_list==""){
			if(data.claim_detail_list==null || data.claim_detail_list==""){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'You do not have any unsubstantiated claim at this time.'
				});

				alertPopup.then(function(res) {
					$location.path('app/hra');
				});
			}else{
				$cordovaDialogs.confirm('You do not have any unsubstantiated claim at this time.', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/hra');
					}
				}); 
			}
				
			}
			else{
				// $scope.debit_card_list=data.debit_card_list;
				$scope.claim_detail_list=data.claim_detail_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.getClaimDetail=function(data){
		//localStorage.setItem('claimData',data)
		$rootScope.claimData=data;
		$location.path("/hranewcardclaim");
	}
	
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hra")
	}
	
})

.controller('hraclaimdetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hra_trans_num=$rootScope.claimData.CLAIM_ID
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				$location.path("/login");
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path("/login");
				}
			});
			return false;
		}
	}else{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'trans_num':$scope.hra_trans_num},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.payment_information==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No Claim Detail'
				});

				alertPopup.then(function(res) {
					$location.path('/hracardclaim');
				});
			}else{
				$cordovaDialogs.confirm('No Claim Detail', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/hracardclaim');
					}
				}); 
			}
				
			}
			else{
				$scope.hra_payment_information=data.payment_information[0];
				$scope.hra_docs_list=data.docs_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					$location.path("/login");
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
			}
		});
	}
	
	$scope.getDocument=function(doc){
		//alert(doc.ATTACHMENT_ID)
		if($rootScope.IOS==true){
			//alert("Http")
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				//alert(data);
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				$cordovaFile.writeFile(cordova.file.dataDirectory, fileName,contentFile, true)
				.then(function (success) {
					//alert("writeFile"+JSON.stringify(success));
					$cordovaFileOpener2.open(cordova.file.dataDirectory+fileName,'application/pdf')
					.then(function(){
						//alert("open")
					},function(err){
						//alert("Error");
						//alert(JSON.stringify(err));
					})
					$scope.activity={};
				}, function (error){	
					// alert("error")
				});
			}).error(function(data){
				//alert("http Error");
				//alert(data);
			});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration/Claim Docs", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'image/png')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}
	
	$scope.goback=function()
	{
		//$location.path("app/hra")
		$location.path("/hraclaimview")
	}
	
})

.controller('hranewcardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter,$timeout,$cordovaToast) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hra_trans_num=$rootScope.claimData.CLAIM_ID
	//alert($scope.hra_trans_num)
	$scope.hra_debit_card_amount = $rootScope.claimData.CLAIM_AMOUNT;
	$scope.imgSrc;
	$scope.floatlabel=false;
	
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}

	$scope.goback=function()
	{
		$scope.plan_types={};
		$location.path("/hranewcardclaimview");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						 $scope.imgSrc=imageData;
						 $scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
	   
	$scope.newclaimsubmit=function(){
		if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else if($scope.hra_trans_num==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: "You Can't upload any receipt"
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert("You Can't upload any receipt")
				.then(function() {
				});
			}
		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			var timer=$timeout(function(){
				//alert("Your request time out");
				$cordovaToast.showShortBottom('Your request time out. Please try again').then(function(success) {
					// success
					$scope.imgSrc= '';
					var myEl = angular.element( document.querySelector( '#receipt' ) );
					myEl.removeAttr('src');
					$ionicLoading.hide();
				}, function (error) {
				// error
				});
			},30000)
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/uploadclaimdocument",{'claim_id':  $scope.hra_trans_num,
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'
			},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$scope.claim_id = data.claim_id;
				$location.path("/hracardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Success',
						template: 'Claim Submitted Successfully'
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim Submitted Successfully', 'Success', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$timeout.cancel(timer);
				$location.path("/hracardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;	
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;		    
					});
					return false;
				}	
				
			}

			}).error(function(err){
			});
		}

	}
})

// Cobra controller
.controller('CobraCtrl', function($scope,$location,$rootScope, $stateParams, $http,$cordovaDialogs,$location,$timeout,$cordovaToast) {
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$rootScope.cobrassn=data.account_types.COBRA.SSN;
	}).error(function(err){
	});

	$scope.goBack=function(){
		if($scope.acctype.HRA==null)
		{	   							 
			$location.path('/app/fsa');				  
		}
		else
		{
			$location.path("/app/hra");
		}

	}
	
})
.controller('CobraaccountCtrl', function($scope,$location,$rootScope, $stateParams, $http,$ionicLoading,$cordovaDialogs,$ionicPopup,$timeout,$cordovaToast) {
	$scope.access_token = localStorage.getItem('access_token');
	$scope.ssn=$rootScope.cobrassn;
	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'cobra','ssn': $scope.ssn},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$ionicLoading.hide();
		$scope.account_information=data.account_information;

	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	});
	
	$scope.goback=function()
	{
		$location.path('/app/cobra');
	}
	
})
.controller('CobraPaymentCtrl', function($scope,$location,$rootScope, $stateParams, $http,$ionicLoading,$cordovaDialogs,$location,$ionicPopup,$timeout,$cordovaToast) {
	$scope.access_token = localStorage.getItem('access_token');
	$scope.ssn=$rootScope.cobrassn;
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-cobra-payments",{params:{'ssn': $scope.ssn},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		if(data.payment_information.length==0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Our record indicates that you do not have any COBRA payments'
				});

				alertPopup.then(function(res){
					$location.path('/app/cobra');
				});
			}else{
				$cordovaDialogs.confirm('Our record indicates that you do not have any COBRA payments', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/app/cobra');
					}
				}); 
			}
		}else{
			$scope.payment_information=data.payment_information;
		}
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					$location.path("/login");
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						$location.path("/login");
					}
				});
				return false;
		}
	});
	
	$scope.goback=function()
	{
		$location.path('/app/cobra');
	}
	
});
