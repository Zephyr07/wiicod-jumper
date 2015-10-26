/**
 * Created by Thedward on 23/10/2015.
 */

angular.module('starter.controllers', [])

  .controller('JeuCtrl',function($scope,$interval,$ionicPopup){
    //tableau boulean pour savoir si l'obstacle est deja en mouvement
    var etatObstacle=[];
    // Tableau de variable qui serviront pour les intervalles
    var intervalObstacle=[];

    var incrementationScore=1;
    var heightJoueur=30;
    var widthJoueur=30;
    var delai;// Delai d'attente avant l'arrivé du prochain obstacle

    var tempsObstacle=3000;
    var valueRight="-100px";
    var actionJoueur=true,etatCrash=false,etatPause=false;
    var i;
    var widthScreen=document.body.clientWidth;
    var intervalJeu,intervalScore;

    delai=tempsObstacle/2.7;

    $scope.level="Niveau 1";
    $scope.score=0;
    $scope.highScore=0;

    var stopJoueur,stopJeu;
    var joueur=$("#joueur");
    var coor=joueur.offset();

    var topInitial=coor.top;



    $scope.stopFight = function(i) {
      if (angular.isDefined(intervalObstacle[i])) {
        $interval.cancel(intervalObstacle[i]);
        intervalObstacle[i] = undefined;
        etatObstacle[i]=false;
      }
    };

    $scope.stopPlayer = function() {
      if (angular.isDefined(stopJoueur)) {
        $interval.cancel(stopJoueur);
        stopJoueur = undefined;
      }
    };

    $scope.jump=function(){

      $scope.stopPlayer(stopJoueur);
      if(actionJoueur==true)
      {
        stopJoueur = $interval(function() {
          yDecallage=20000/tempsObstacle;
          //console.log(yDecallage);
          joueur.css("top","-="+yDecallage);
          var top=joueur.offset().top;

          // il ne peut pas sauter plus de 85% de la hauteur de l'ecran
          //if(top<=(parseInt(0.85*topInitial))){
          if(top<=(topInitial-150)){
            $scope.stopPlayer(stopJoueur);
            joueur.css("top",top);
          }
        }, 25);
      }

    }

    $scope.down=function(){
      if(etatCrash==false)
      {
        $scope.stopPlayer(stopJoueur);
        stopJoueur = $interval(function() {
          yDecallage=20000/tempsObstacle;
          joueur.css("top","+="+yDecallage);
          var top=joueur.offset().top;
          //console.log(top);
          if(top>=topInitial){
            $scope.stopPlayer(stopJoueur);
            joueur.css('top',topInitial);
          }
        }, 25);
      }
    }

    $scope.pause=function(){
      etatPause=true;
      $scope.popupPause();
      $scope.stopPlayer(stopJoueur);
      stopAll();
      $interval.cancel(intervalScore);
    }

    $scope.crash=function(){
      etatCrash=true;
      stopAll();
      $interval.cancel(intervalJeu);
      $scope.popupEndOfGame();
      $interval.cancel(intervalScore);
    }

    $scope.popupPause = function() {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Pause',
        template: 'Votre score est de '+$scope.score,
        buttons: [
          {
            text: '<span class="icon ion-refresh"></span>',
            type: 'button-assertive',
            onTap: function(e) {
              $scope.reset();
            }
          },
          {
            text: '<span class="icon ion-play"></span>',
            type: 'button-balanced',
            onTap: function(e) {
              etatPause=false;
              incrementerScore();
            }
          },
          {
            text: '<span class="icon ion-home"></span>',
            type: 'button-positive',
            onTap: function(e) {

            }
          }
        ]
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };

    $scope.popupEndOfGame  = function() {

      var confirmPopup = $ionicPopup.alert({
        title: 'Partié Terminée',
        template: 'Votre score est de <span class="score">'+$scope.score+'</span>',
        buttons: [
          {
            text: '<i class="icon ion-android-home"></i>',
            type: 'button-positive',
            onTap: function(e) {
              console.log("Quitter");

            }
          },
          {
            text: '<i class="icon ion-refresh"></i>',
            type: 'button-positive',
            onTap: function(e) {
              console.log("recommencer");
              $scope.reset();
            }
          }
        ]
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };

    $scope.reset=function(){
      $scope.score=0;
      $(".obstacle").css("right",valueRight);
      $("#joueur").css("top",topInitial);
      actionJoueur=true;
      etatCrash=false;
      etatPause=false;
      $scope.init();
      $scope.level="Niveau 1";
    }

    $scope.collisionDetection=function(i){

      var leftJoueur=parseInt($("#joueur").offset().left);
      var topJoueur=parseInt($("#joueur").offset().top);
      var bottomJoueur=topJoueur+heightJoueur;
      var leftObstacle=parseInt($("#obstacle"+i).offset().left);
      var topObstacle=parseInt($("#obstacle"+i).offset().top);
      var bottomObstacle=topObstacle+40;

      var etat=false;

      //console.log((leftJoueur+widthJoueur) + " | " + leftObstacle + " | " + bottomJoueur + " | " + bottomObstacle);
      if((leftJoueur+widthJoueur)>leftObstacle)
      {
        if(bottomJoueur<topObstacle ){
          //console.log("Success No collision");
          //$scope.score+=incrementationScore;
        }
        else if(topJoueur>bottomObstacle) {
          // No collision
          //console.log("No Collision");
          //$scope.score+=incrementationScore;
        }
        else if(topJoueur<=bottomObstacle ){
          if((leftJoueur+widthJoueur)>leftObstacle && (leftJoueur)<leftObstacle){
            //console.log("Failed collision detected");
            //console.log((leftJoueur+50) + " | " + topJoueur + " | " + bottomJoueur + " | " + leftObstacle + " | " + topObstacle + " | " + leftObstacle);
            etat=true;
          }
        }
        else if(bottomJoueur>=topObstacle)
        {

        }
        else if((topJoueur<=bottomObstacle || bottomJoueur>=topObstacle)&& (leftJoueur+widthJoueur)==leftObstacle){

        }
      }
      else if(topJoueur>bottomObstacle && bottomJoueur<topObstacle){
        // rien
      }

      /**
       * check the score to know if its time to upgrade level
       */
      checkScore();

      if(etat==true)
      {
        $scope.stopFight(i);
        //$scope.stopPlayer(stopJoueur);
        actionJoueur=false;
        $scope.crash();
      }

    }

    $scope.init=function(){
      //console.log("init");
      // chaque delai on lance un obstacle
      intervalJeu=$interval(function(){
        if(etatPause==false) {
          var index = parseInt(Math.random() * 9);

          // lancement de l'obstacle
          startObstacle(index);
        }
      },delai)

      incrementerScore();

    }

    /**
     * Cette fonction permet de stopper toutes les annimations en cours
     */
    function stopAll(){
      for(i=0;i<intervalObstacle.length;i++)
      {
        $interval.cancel(intervalObstacle[i]);
        intervalObstacle[i]=undefined;
        etatObstacle[i]=false;
      }
    }

    /**
     * Cette fonction permet de lancer l'annimation de l'obstacle i
     * @param i index de l'obstacle
     */
    function startObstacle(i){
      //console.log("Startobstacle "+ intervalObstacle[i])
      if(intervalObstacle[i]==undefined)
      {
        var obs=$("#obstacle"+i);
        obs.addClass("obstacle"+(i+1));
        etatObstacle[i]=true;

        intervalObstacle[i]= $interval(function() {

          $scope.collisionDetection(i);

          // Calcul de la valeur a incementer en fonction de la largeur de l'ecran
          decalage=widthScreen*25/tempsObstacle;

          obs.css("right","+="+decalage);
          var left=obs.offset().left;
          if(left<=-20){
            //console.log("ed");
            obs.css("right",valueRight);
            $scope.stopFight(i);
          }
        }, 25);
      }


    }

    /**
     * Cette fonction permet deverifier létat du score et d'y augmenter le level ou pas
     */

    function checkScore(){
      // Level 1
      if(500<$scope.score && $scope.score<=1500){
        $scope.level="Niveau 2";
        incrementationScore=1.5;
        tempsObstacle=4500;
      }
    }

    function incrementerScore(){
      intervalScore=$interval(function(){
        $scope.score+=1;
        checkScore();
      },100)
    }
  })

