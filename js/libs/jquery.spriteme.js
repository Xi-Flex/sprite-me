/*! 
jquery spriteMe - v1 - 2015-02-10  
Friant @ W2P Digital
*/

(function($) {
'use strict';

    // var du timer&renderer pour controller les fps
    var init = function (options) {
        return this.each(function () {
            var $this = $(this);
            /////////////////////////////////////////////
            // les vars pour le fonctionnement du plugin
            /////////////////////////////////////////////
            $this.data('internalVars',{
                // "Timer" pour controller les FPS
                fpsInterval: 42, 
                startTime:false,
                now:false,
                then:false,
                elapsed:false,

                renderID:false, // ID de requestAnimationFrame

                width: $this.width(),
                height: $this.height(),
                currentFrame:0,
                totalFrames: false,
                columns: false,
                rows: false,                                    
            })
            var internalVars = $this.data('internalVars');


            /////////////////////////////////////////////
            // les vars configurable par le user
            /////////////////////////////////////////////
            $this.data('settings',{
                fps: 12,
                loop: false,
                autoplay: true,
                gotoframe:false,
                reverse:false,
                maxframe: false, // si on a un sprite qui a 10 frames mais que notre animation en a que 9.   
                complete: function () {},
            });
            // on fusionne les deux objets 
            // les 'options' ecrasent les valeurs predéfinies de settings
            var settings = $.extend( $this.data('settings'), options);


            /////////////////////////////////////////////
            // les methodes internes du plugin
            /////////////////////////////////////////////
            $this.data('internalFunctions', {
                ///LOOP DU RENDU GRAPHIQUE
                renderer: function (){

                            // request de la prochaine frame
                            internalVars.renderID = requestAnimationFrame(internalFunctions.renderer); 
                            // Calcule du temps depuis la derniere image
                            internalVars.now = Date.now();
                            internalVars.elapsed = internalVars.now - internalVars.then;
                            // Si ya eu assez de temps on dessine l'image suivante
                            if (internalVars.elapsed > internalVars.fpsInterval) {
                                // on prepare les variables du timer pour la prochaine images avec then=now,

                                // adjust your specified fpsInterval not being a multiple of RAF's interval (16.7ms) with "- (elapsed % fpsInterval)"
                                internalVars.then = internalVars.now - (internalVars.elapsed % internalVars.fpsInterval);

                                // maintenant je dessine l'image || fait l'action

                                
                                //SI JE JOUE PAS A L'ENVERS
                                if(!settings.reverse){ 
                                    //si je suis au bout de l animation
                                    if (internalVars.currentFrame >= internalVars.totalFrames) {
                                        if (settings.loop) {
                                            $this.spriteMe('gotoframe');
                                        } else {
                                            cancelAnimationFrame(internalVars.renderID);
                                            settings.complete();
         
                                        }
                                    }else{

                                        //si il y a une limite de frame
                                        if(settings.maxframe !== false){

                                            // on a dépassé maxframe
                                            if (internalVars.currentFrame >= settings.maxframe) {

                                                if (settings.loop === true) {
                                                    $this.spriteMe('gotoframe');
                                                } else {
                                                    cancelAnimationFrame(internalVars.renderID); // je coupe l'annimation
                                                    settings.complete(); // j appelle le conplete de settings
                                                }
                                            }else{
                                                // si on est pas au bout des maxframe, je continue
                                                $this.spriteMe('gotoframe');
                                            }
                                        }else{
                                            // si il n y a pas de maxframe, je continue
                                            $this.spriteMe('gotoframe');
                                        }
                                    }
                                }else{
                                    // SI JE JOUE A L ENVERS
                                    //si je suis au bout de l animation
                                    if (internalVars.currentFrame <= 0 ) {
                                        if (settings.loop) {
                                            $this.spriteMe('gotoframe');
                                        } else {
                                            cancelAnimationFrame(internalVars.renderID);// je coupe l'annimation
                                            settings.complete();// j appelle le conplete de settings
                                        }
                                    }else{
                                        // si ya maxframe
                                        if(settings.maxframe !== false){
                                            // on a dépassé maxframe
                                            if (internalVars.currentFrame <= settings.maxframe) {

                                                if (settings.loop === true) {
                                                    $this.spriteMe('gotoframe');
                                                } else {
                                                    cancelAnimationFrame(internalVars.renderID);// je coupe l'annimation
                                                    settings.complete();
                                                }
                                            }else{
                                                // si on est pas au bout des maxframe, je continue
                                                $this.spriteMe('gotoframe');
                                            }
                                        }else{
                                            // si il n y a pas de maxframe, je continue
                                            $this.spriteMe('gotoframe');
                                        }
                                    }

                                }

                            }// fin de di ya eu assez de temps on dessine l'image suivante 
                        },
                loadImage: function (){
                            //load le background
                            var imageSrc = $this.css('background-image').replace(/url\((['"])?(.*?)\1\)/gi, '$2');
                            var image = new Image();
                            image.src = imageSrc;
                            //
                            image.onload = function () {
                                var width = image.width,
                                    height = image.height;

                                // on choppe le nombre de collones et de lignes
                                // calcue les fps ect
                                internalVars.columns = Math.round(width / internalVars.width);
                                internalVars.rows = Math.round(height / internalVars.height);
                                internalVars.totalFrames = (internalVars.columns * internalVars.rows) - 1;       
                                internalVars.fpsInterval = 1000/settings.fps;
                                internalVars.then = Date.now();
                                internalVars.startTime = internalVars.then;

                                // si j'ai un max frame je verifie qu'il pas plus grand que le total frame
                                if(settings.maxframe !== false){
                                    if(settings.maxframe > internalVars.totalFrames){
                                        $.error('maxframe ne peut pas être supperieur au nombre total de frame dans le sprite.');
                                    }
                                }

                                //si j'ai définie reverse sur true au debut 
                                if(settings.reverse){

                                    if(settings.maxframe !== false){
                                        // si jai maxframe je set la currentframe sur maxframe
                                        internalVars.currentFrame = settings.maxframe;
                                        $this.spriteMe('gotoframe'); // j'affiche la frame en question

                                    }else{
                                        // si jai pas de maxframe je set la currentframe sur total frame
                                        internalVars.currentFrame = internalVars.totalFrames;
                                        $this.spriteMe('gotoframe'); // j'affiche la frame en question
                                    }
                                }

                                if(settings.gotoframe !== false){
                                    // si je jump direct sur une frame dès le debut
                                    internalVars.currentFrame = settings.gotoframe;
                                    $this.spriteMe('gotoframe'); // j'affiche la frame en question
                                }

                                // si autoplay...
                                if (settings.autoplay === true) {
                                    internalVars.renderID = requestAnimationFrame(internalFunctions.renderer);
                                }

                            };
                        },
                defineFrameNumber: function(){

                    if(settings.reverse){ // si je joue à l'envers


                        // si ya pas de max frame
                        if(settings.maxframe === false){
                            // et si je suis à la premiere frame
                            if(internalVars.currentFrame <= 0){
                                // je reviens au debut - 1 
                                internalVars.currentFrame =  internalVars.totalFrames - 1;
                            }else{
                                // sinon je décrémente normalement
                                internalVars.currentFrame--;
                            }

                        }else{
                            // si ya une max frame
                            // et si je suis à la premiere frame
                            if(internalVars.currentFrame <= 0){
                                // je vais au debut -1 
                                internalVars.currentFrame =  settings.maxframe - 1;
                            }else{
                                // sinon je décrémente normalement
                                internalVars.currentFrame--;
                            }
                        }

                    }else{//si je joue pas à l'envers


                        //si je suis au bout de l animation
                        if (internalVars.currentFrame >= internalVars.totalFrames) {

                            internalVars.currentFrame = 0;

                        }else{
                            //si il y a une limite de frame
                            if(settings.maxframe !== false){
                            
                                // si on a dépassé maxframe
                                if (internalVars.currentFrame >= settings.maxframe) {
                                    internalVars.currentFrame = 0;
                                }else{
                                    // si on a PAS dépassé maxframe, j'avance
                                    internalVars.currentFrame++;
                                }
                            }else{
                                // j'avance normalement dans une situation normal
                                internalVars.currentFrame++;
                            }
                          
                        }

                    } // end !settings.revers
                    // console.log(internalVars.currentFrame);
                }// end defineFrame
            
            });
            var internalFunctions = $this.data('internalFunctions');
            internalFunctions.loadImage();
        });
    };  


    var gotoframe = function (frameNumber) {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');            

            if (typeof frameNumber === "undefined" || frameNumber === null) {  // Si on passe aucun paramettre
                internalFunctions.defineFrameNumber();
                var row = Math.floor(internalVars.currentFrame / internalVars.columns);
                var column = internalVars.currentFrame % internalVars.columns;          
            }else{  
                // sinon je set la frame avec le paramettre "frameNumber"
                internalVars.currentFrame = frameNumber;
                var row = Math.floor(frameNumber / internalVars.columns);
                var column = frameNumber % internalVars.columns;
            }

            $(this).css('background-position', (-internalVars.width * column) + 'px ' + (-internalVars.height * row) + 'px');
        });
    };

    // coup l'animation
    var stop = function () {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');  

            cancelAnimationFrame(internalVars.renderID);
        });        
    };

    //lance l'animation
    var resume = function () {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');

            internalVars.renderID = requestAnimationFrame(internalFunctions.renderer);
        });        

    };

    // relance l'animation
    var restart = function () {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');  

            // si je suis en reverse
            if(settings.reverse){
                internalVars.currentFrame = internalVars.totalFrames;
            }else{
                internalVars.currentFrame = 0;
            }

            internalVars.renderID = requestAnimationFrame(internalFunctions.renderer);
        });        
    };

    // inverse le sens de lecture
    var reverse = function () {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');  

            settings.reverse = !settings.reverse;
        });        
    };

    // change les fps de l'animation
    var fps = function (ips) {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');   

            settings.fps = ips;
            internalVars.fpsInterval=1000/settings.fps;
        });        
    };

    //change le maxframe
    var setmaxframe = function (numframe) {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings'); 

            if(numframe > internalVars.totalFrames){
                $.error('maxframe ne peut pas être supperieur au nombre total de frame dans le sprite.');
            }else{
                settings.maxframe = numframe;
            }
            
        });        
    };

    // change la loop, true ou false
    var setloop = function (val) {
        return this.each(function () {
            var internalVars = $(this).data('internalVars'),
                internalFunctions = $(this).data('internalFunctions'),
                settings = $(this).data('settings');   
            if(typeof val === 'boolean'){
                settings.loop = val;
            }else{
                $.error('La méthode setloop() n\'accepte que des boolean.');
            }
            
        });        
    };

    var methodes = {
        init: init,
        gotoframe: gotoframe,
        stop: stop,
        resume: resume,
        restart: restart,
        play: resume,
        reverse: reverse,
        setmaxframe: setmaxframe,
        setloop: setloop,
        fps: fps
    };



    $.fn.spriteMe = function (methode) {

        if (methodes[methode]) {
            return methodes[methode].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methode === 'object' || ! methode) {
            return methodes.init.apply(this, arguments);
        } else {
            $.error('La méthode " ' + methode + ' " n\'existe pas dans jQuery.spriteMe.');
        }

    };



//Polyfill & fallback (pour ie9 genre)
//
    var lastTime = 0,
        vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }






})(jQuery);
