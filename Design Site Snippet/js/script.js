function activeAbout() {

			document.getElementById('aboutcontent').classList.remove('invis');
			document.getElementById('portfoliocontent').classList.add('invis');
			document.getElementById('contactcontent').classList.add('invis');




		document.getElementById('about').classList.remove('nav-text');
		document.getElementById('about').classList.add('nav-text');
		document.getElementById('about').classList.add('active');

		document.getElementById('portfolio').classList.remove('active');
		document.getElementById('contact').classList.remove('active');

		/**/

		document.getElementById('dotabout').classList.remove('nav-circle');
		document.getElementById('dotabout').classList.add('nav-circle');
		document.getElementById('dotabout').classList.add('active');

		document.getElementById('dotportfolio').classList.remove('active');
		document.getElementById('dotcontact').classList.remove('active');


	}

function activePortfolio() {

		document.getElementById('portfoliocontent').classList.remove('invis');
		document.getElementById('aboutcontent').classList.add('invis');
		document.getElementById('contactcontent').classList.add('invis');


		document.getElementById('portfolio').classList.remove('nav-text');
		document.getElementById('portfolio').classList.add('nav-text');
		document.getElementById('portfolio').classList.add('active');

		document.getElementById('about').classList.remove('active');
		document.getElementById('contact').classList.remove('active');

		/**/

		document.getElementById('dotportfolio').classList.remove('nav-circle');
		document.getElementById('dotportfolio').classList.add('nav-circle');
		document.getElementById('dotportfolio').classList.add('active');

		document.getElementById('dotabout').classList.remove('active');
		document.getElementById('dotcontact').classList.remove('active');

	}

function activeContact() {

		document.getElementById('aboutcontent').classList.add('invis');
		document.getElementById('portfoliocontent').classList.add('invis');
		document.getElementById('contactcontent').classList.remove('invis');


		document.getElementById('contact').classList.remove('nav-text');
		document.getElementById('contact').classList.add('nav-text');
		document.getElementById('contact').classList.add('active');

		document.getElementById('portfolio').classList.remove('active');
		document.getElementById('about').classList.remove('active');

		/**/

		document.getElementById('dotcontact').classList.remove('nav-circle');
		document.getElementById('dotcontact').classList.add('nav-circle');
		document.getElementById('dotcontact').classList.add('active');

		document.getElementById('dotportfolio').classList.remove('active');
		document.getElementById('dotabout').classList.remove('active');
	}
