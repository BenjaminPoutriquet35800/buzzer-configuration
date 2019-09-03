 /**
  * Se charge de créer un élement hyperLink
  * @param {*} value La valeur textuelle
  * @param {*} link Le lien
  * @param {*} className La class css
  * @param {*} onClickFunc La fonction à éxécuter lors du clic
  */
 const createHyperLinkElement = function (value, link, className, onClickFunc) {
     var hyperLink = document.createElement('a');
     hyperLink.innerHTML = value;
     hyperLink.className = className;
     hyperLink.href = link;
     if (typeof onClickFunc === 'function') {
         hyperLink.onclick = onClickFunc;
     }
     return hyperLink;
 }

 /**
  * Se charge de créer un élément HTML span
  * @param {*} value La valeur textuelle à l'interieur de l'élément
  * @param {*} className La class css
  * @param {*} dataAttributes Une liste d'attributs custom's formatté ainsi :
  * [ {
  *  property : nom de l'attribut,
  *  value : la valeur
  * }]
  */
 const createSpanElement = function (value, className, dataAttributes) {
     var spanElement = document.createElement('span');
     spanElement.innerHTML = value;
     spanElement.className = className;
     // Ajoute des custom's attributes si il y'en a
     if (dataAttributes instanceof Array) {
        dataAttributes.map(element => {
            spanElement.setAttribute(element.property, element.value);
        })
     }
     return spanElement;
     //<span class="new badge" data-badge-caption="17/100">Qualité</span>    
 }

 /**
  * Se charge de créer un élément HTML option
  * @param {*} value la valeur cacher par le composant
  * @param {*} innerHTML La valeur à afficher
  */
 const createOptionElement = function(value,innerHTML) {
     var option = document.createElement('option');
     option.value = value;
     option.innerHTML = innerHTML;
     return option;
 }

 /**
  * Se charge d'afficher un composant si ce n'est pas déjà le cas
  * @param {*} $component Le composant (Jquery) à afficher 
  * @param {*} withEffect Indique si l'on veut jouer un effet
  */
 const showComponent = function ($component, withEffect) {
     if (!$component.is(':hidden'))
         return;
     if (withEffect)
         $component.show("slow");
     else
         $component.show();
 }

 /**
  * Se charge de cacher un composant si ce n'est pas déjà le cas
  * @param {*} $component Le composant (Jquery) à cacher
  * @param {*} withEffect Indique si l'on veut jouer un effet
  */
 const hiddenComponent = function ($component, withEffect) {
     if ($component.is(':hidden'))
         return;
     if (withEffect)
         $component.hide("slow");
     else
         $component.hide();
 }