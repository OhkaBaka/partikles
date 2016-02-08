// More notes than anything else
// I figured it might be revealing to git this little monster step by step so the whole world can see my process.
// ...having typed that now I believe that might be the worst idea ever.

/* Development Diary

  01/22/2016 - I built a little script that lets you embed an html generated "1up" the scrolls off the screen every time you enter the Konami Code, in the process I revisited a bunch of ideas I had from the original particle tool I built for GEngHIS, I decided it was time to build those ideas out in a more modern more experienced way.
  01/25/2016 - I started building a pseudo object, collecting everything I've done to date into some kind of framework I can actually manage
  01/25/2016 - Reimagining this thing, rather than trying to rebuild it, is an excercise in "biting off more than one expected to chew"... but will chew... I will chew
  02/02/2016 - Wild hair: Embed all the letters and numbers, in the NES 7x7 font into the script so I can spell things.
  02/03/2016 - Ok... so I'll do numbers later... Looking over my previous passes of the code looking 
  02/04/2016 - I built the movement function.  I wanted to get the trajectory math piece out of the way so it isn't bothering me.  I also started the particle builder logic.
  02/07/2016 - Finished adding the numbers... that was monotonous.  Here's hoping I find a good use for them.
  
*/

function partikles( profileIn ){
	// generate template particle in document
	template_partikle = $( document.createElement('div') ).addClass('partikleTemplate').css('display','block').css('position','absolute').css('margin','0px').css('padding','0px').css('border','none').css('font','1px verdana').css('width','5px').css('height','5px').css('background-color','blue');
	$(document).append( template_partikle );
	$( template_partikle ).position('-10px','-10px');



	// Establish a default particle profile
	emitter = {
		pattern = {
			// [d] indicates the variable can have a decay calculation applied to it
			// [v] indicates the variable can have a variance calculation applied to it
			// [g] generated value not manipulable by user

			name: 'Campfire with Smoke',		// Human readable name... will be added as machine name replacing upper case to lower, and replacing spaces with underscore
			machineName: 'campfire_with_smoke',	// [g]

			emitterAge: 0,						// [g] 
			emitterLifespan: 0,					// Emitter lifespan, after interval, spawns stop, after spawning stops and particles decay, emitter unloads
			emitterChildren: 40,				// Maximum particles for this emitter
			emitterSpawnrate: 3,				// [v] particles generated per cycle
			emitterAttachment: 'atCursor'		// string 'atCursor' (cursor current position), string 'toCursor' (follows cursor), array [x,y,attachment] (attaches to point by attachment, "document" == scrollable, "window" == "fixed")

			// Particle values are attached to each particle at creation (with variance applied, when applicable)
			decay: 50,							// [v] number of cycles before decay
			width: 9,height: 9,					// [dv] particle size, independent of structure complexity (a 5x5 particle structure can be scaled down to 3x3, up to 10x10, etc)
			border: true,						// simple border to create color 0 border, around the pixels in each particle

			colorProfile:
				[ '#000', '#AAA', '#FFF'] ] 	// color table style, shapeProfile can refer to these colors as 0, 1, and 2
				[ [1,1,1], [255,255,255] ] 		// random color range style, color generated will be within the range of colors in the set the example would produce any color

			shapeProfile: [ [ 0, 1, 2 ], [1, 2, 2], [2, 1, 0] ],  // columns and rows referring to colors listed in the colorProfile variable, or, for monochromatic particles, true/false for on and off

			direction: 180, 					// [dv]
			velocity: 3,						// [dv]

			//  Variants are +/- their base values, based on percentage.
			//    eg. a base value of 20 with a variant of .5 can produce a result of 10-30, values more than 100% are considered 100%
			decayVariance: 1,					// variation on length of decay, attached to particle at creation
			birthVariance: .5,					// variation on births per cycle
			velocityVariance: 0,				// variation on births per cycle
			directionVariance: 0,				// variation on births per cycle

			// Decay rules are simple array processes that allow values to change as the particle ages

		},

		move: function( partix ){
			inX = this.partikles[partix].left;
			inY = this.partikles[partix].top;
			vel = this.partikles[partix].velocity;
			ang = this.partikles[partix].angle;
			age = this.partikles[partix].age;

			// Check Decay of Angle and Velocity


			// Apply Direction Variance

			rads = angle*0.01745327;
			outX = inX + velocity*Math.cos(rads);
			outY = inY + velocity*Math.sin(rads);



		},

		spawn: function (){
			if( typeof( particles[0] ) == 'undefined' ) ix = 0;
			else ix = particles.length;
			particles[ix] = new Object();
			particles[ix].style = style;
			particles[ix].birthX = '-10';
			particles[ix].birthY =  '-10';
			particles[ix].age = Math.ceil( Math.random() * styles[ style ].decay );


			particles[ix].div.innerHTML = '';
			for( ixA = 1; ixA <= styles[ style ].shape.length; ixA++ ){
				for( ixB = 1; ixB <= styles[ style ].shape[ixA-1].length; ixB++ ){
					if( styles[ style ].shape[ixA-1][ixB-1] )particles[ix].div.innerHTML += '<div style="display:block;float:left;width:' + 100/styles[ style ].shape[ixA-1].length + '%; height:' + 100/styles[ style ].shape.length + '%; margin:0; padding:0;" id="' + ix + 'd' + ixA + ixB + '"></div>';
					else particles[ix].div.innerHTML += '<div style="display:block;float:left;width:' + 100/styles[ style ].shape[ixA-1].length + '%; height:' + 100/styles[ style ].shape.length + '%; margin:0; padding:0;" id="' + ix + 'd' + ixA + ixB + '"></div>';
				}
			}

			particles[ix].div.style.opacity = opacityCheck( styles[ style ], 1 )/100;
			particles[ix].div.style.filter = 'alpha(opacity=' + opacityCheck( styles[ style ], 1 ) +')';

			document.body.appendChild( particles[ix].div );
		}


	}


	structures = {
		oneup = [
			[0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,0],[0,1,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1],[0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1],[0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1],[0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,0],[0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0],[1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0]
		],
		a = [[0,0,1,1,1,0,0],[0,1,1,0,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,1,1,1,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1]],
		b = [[1,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,1,1,1,1,0]],
		c = [[0,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		d = [[1,1,1,1,1,0,0],[1,1,0,0,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,1,1,0],[1,1,1,1,1,0,0]],
		e = [[1,1,1,1,1,1,1],[1,1,0,0,0,0,0],[1,1,0,0,0,0.0],[1,1,1,1,1,1,1],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,1,1,1,1,1]],
		f = [[1,1,1,1,1,1,1],[1,1,0,0,0,0,0],[1,1,0,0,0,0.0],[1,1,1,1,1,1,1],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0]],
		g = [[0,0,1,1,1,1,1],[0,1,1,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,1,1,1],[1,1,0,0,0,1,1],[0,1,1,0,0,1,1],[0,0,1,1,1,1,1]],
		h = [[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,1,1,1,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1]],
		i = [[1,1,1,1,1,1,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[1,1,1,1,1,1,0]],
		j = [[0,0,0,0,0,1,1],[0,0,0,0,0,1,1],[0,0,0,0,0,1,1],[0,0,0,0,0,1,1],[0,0,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		k = [[1,1,0,0,0,1,1],[1,1,0,0,1,1,0],[1,1,0,1,1,0,0],[1,1,1,1,0,0,0],[1,1,1,1,1,0,0],[1,1,0,1,1,1,0],[1,1,0,0,1,1,1]],
		l = [[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0],[1,1,1,1,1,1,1]],
		m = [[1,1,0,0,0,1,1],[1,1,1,0,1,1,1],[1,1,1,1,1,1,1],[1,1,0,1,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1]],
		n = [[1,1,0,0,0,1,1],[1,1,1,0,0,1,1],[1,1,1,1,0,1,1],[1,1,1,1,1,1,1],[1,1,0,1,1,1,1],[1,1,0,0,1,1,1],[1,1,0,0,0,1,1]],
		o = [[0,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		p = [[1,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,1,1,1,1,0],[1,1,0,0,0,0,0],[1,1,0,0,0,0,0]],
		q = [[0,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,1,1,1,1],[1,1,0,0,1,1,0],[0,1,1,1,1,0,1]],
		r = [[1,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,1,1,1],[1,1,1,1,1,0,0],[1,1,0,1,1,1,0],[1,1,0,0,1,1,1]],
		s = [[0,1,1,1,1,0,0],[1,1,0,0,1,1,0],[1,1,0,0,0,0,0],[0,1,1,1,1,1,0],[0,0,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		t = [[1,1,1,1,1,1,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0]],
		u = [[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		v = [[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,0,1,1,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0]],
		w = [[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[1,1,1,0,1,1,1],[1,1,0,0,0,1,1]],
		x = [[1,1,0,0,0,1,1],[1,1,1,0,1,1,1],[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,1,0,1,1,1],[1,1,0,0,0,1,1]],
		y = [[1,1,0,0,1,1,0],[1,1,0,0,1,1,0],[1,1,0,0,1,1,0],[0,1,1,1,1,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0]],
		z = [[1,1,1,1,1,1,1],[0,0,0,0,1,1,1],[0,0,0,1,1,1,0],[0,0,1,1,1,0,0],[0,1,1,1,0,0,0],[1,1,1,0,0,0,0],[1,1,1,1,1,1,1]],
		n0 = [[0,0,1,1,1,0,0],[0,1,0,0,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,0,0,1,0],[0,0,1,1,1,0,0]],
		n1 = [[0,0,1,1,0,0,0],[0,1,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[1,1,1,1,1,1,0]],
		n2 = [[0,1,1,1,1,1,0],[1,1,0,0,0,1,1],[0,0,0,0,0,1,1],[0,0,1,1,1,1,0],[0,1,1,1,0,0,0],[1,1,1,0,0,0,0],[1,1,1,1,1,1,1]],
		n3 = [[1,1,1,1,1,1,1],[0,0,0,0,1,1,0],[0,0,0,1,1,0,0],[0,0,1,1,1,1,0],[0,0,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		n4 = [[0,0,0,1,1,1,0],[0,0,1,1,1,1,0],[0,1,1,0,1,1,0],[1,1,0,0,1,1,0],[1,1,1,1,1,1,1],[0,0,0,0,1,1,0],[0,0,0,0,1,1,0]],
		n5 = [[1,1,1,1,1,1,0],[1,1,0,0,0,0,0],[1,1,1,1,1,1,0],[0,0,0,0,0,1,1],[0,0,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		n6 = [[0,0,1,1,1,1,0],[0,1,1,0,0,0,0],[1,1,0,0,0,0,0],[1,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
		n7 = [[1,1,1,1,1,1,1],[1,0,0,0,0,1,1],[0,0,0,0,1,1,0],[0,0,0,1,1,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0],[0,0,1,1,0,0,0]],
		n8 = [[0,1,1,1,1,0,0],[1,1,0,0,0,1,0],[1,1,1,0,0,1,0],[0,1,1,1,1,0,0],[1,0,0,1,1,1,1],[1,0,0,0,0,1,1],[0,1,1,1,1,1,0]],
		n9 = [[0,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,1],[0,0,0,0,0,1,1],[0,0,0,0,1,1,0],[0,1,1,1,1,0,0]]
	}
	return emitter;
}




