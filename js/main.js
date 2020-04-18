window.URL = window.URL || window.webkitURL;

// deflate

function decode( string ) {

  return RawDeflate.inflate( window.atob( string ) );

}

function encode( string ) {

  return window.btoa( RawDeflate.deflate( string ) );

}

var container = decode('pVNNT8MwDL3vV5RIHNe0nBBaJsT4OoDGYRw4pom7pkuTKnG1lV9Pug72gdhAnCw/Pz8/R87o7HY6mb293EWPs+en8WBUYKUjzc2cETCkA4DLECpAHomCOw/IyOvsfnhJPmElGZF2WqOq1DuQSHLkjKQHdeEVfhWTveJSOcgdr/bLWplF5EAz4rHV4AsAJFERqIwI76kDI8HRiisTh7xroRu3mZVtCF44VWOEbQ2MIKyQgvJgepisR+8C48G5Dxp9tm33TjBSINb+ilIhTeljoW0jc80dxMJWlJd8RbXKPMVgD+LS0zRNNkkV7JXB3Xfh3ldlZaPD5v8ds5b5YdJftIXV1g077TiJ0z49ssSedGPqxXytt/Ou1xdBKKFZo7TcxY8JhvHBDHV8qUwwiUcX25Il/IZ80+Q5uAew4QBd+4pK+xMdU5cpnFiDzp7k9md5SKKbk6TdBxsPPgA=');
var defaultCode = decode('lZDBCsIwEETv+Yo5C5EkmoOfE2ywRYWytdA25N+73eYQBMHeMrvzZjebMMCcHTJCUIrGV+QH3mFqYv9pcUVSQMIMu1noXpSuJXHXc9FJ1g204OLRjhHW7MG1S1c2/eXLZYWh755RRrPhxPCyEzN8gTMe1DV/APowwcscnfEL4QsJ4IwAWzifmgtW9CQfZynRTK0=');

var documents = [ { filename: 'Untitled', filetype: 'text/plain', autoupdate: true, code: defaultCode } ];

if ( localStorage.codeeditor !== undefined ) {

  documents = JSON.parse( localStorage.codeeditor );

}

if ( window.location.hash ) {

  var hash = window.location.hash.substr( 1 );
  var version = hash.substr( 0, 2 );

  if ( version == 'A/' ) {

    alert( 'That shared link format is no longer supported.' );

  } else if ( version == 'B/' ) {

    documents[ 0 ].code = decode( hash.substr( 2 ) );

  }

}

// preview

var preview = document.getElementById( 'preview' );

// editor

var interval;

var editor = document.getElementById( 'editor' );
var codemirror = CodeMirror( editor, {

  value: documents[ 0 ].code,
  mode: 'text/html',
  lineNumbers: true,
  matchBrackets: true,
  indentWithTabs: true,
  tabSize: 4,
  indentUnit: 4

} );

codemirror.on( 'change', function() {

  buttonSave.style.display = '';
  buttonDownload.style.display = 'none';

  if ( documents[ 0 ].autoupdate === false ) return;

  clearTimeout( interval );
  interval = setTimeout( update, 500 );

} );

// toolbar

var toolbar = document.getElementById( 'toolbar' );

var buttonUpdate = document.createElement( 'button' );
buttonUpdate.className = 'button';

var checkbox = document.createElement( 'input' );
checkbox.type = 'checkbox';

if ( documents[ 0 ].autoupdate === true ) checkbox.checked = true;

checkbox.style.margin = '-4px 4px -4px 0px';
checkbox.addEventListener( 'click', function ( event ) {

  event.stopPropagation();

  documents[ 0 ].autoupdate = documents[ 0 ].autoupdate === false;

  localStorage.codeeditor = JSON.stringify( documents );

}, false );
buttonUpdate.appendChild( checkbox );
buttonUpdate.appendChild( document.createTextNode( 'update' ) );

buttonUpdate.addEventListener( 'click', function ( event ) {

  update();

}, false );
toolbar.appendChild( buttonUpdate );

var buttonHide = document.createElement( 'button' );
buttonHide.className = 'button';
buttonHide.textContent = 'hide code';
buttonHide.addEventListener( 'click', function ( event ) {

  toggle();

}, false );
toolbar.appendChild( buttonHide );

var buttonMenu = document.createElement( 'button' );
buttonMenu.className = 'button';
buttonMenu.innerHTML = '<svg width="8" height="8"><path d="M 0,1.5 8,1.5 M 0,4.5 8,4.5 M 0,7.5 8,7.5"></svg>';
buttonMenu.addEventListener( 'click', function ( event ) {

  menu.style.display = menu.style.display === '' ? 'none' : '';

}, false );
toolbar.appendChild( buttonMenu );

toolbar.appendChild( document.createElement( 'br' ) );

var menu = document.createElement( 'span' );
menu.style.display = 'none';
toolbar.appendChild( menu );

var buttonSave = document.createElement( 'button' );
buttonSave.className = 'button';
buttonSave.textContent = 'save';
buttonSave.addEventListener( 'click', function ( event ) {

  save();

}, false );
menu.appendChild( buttonSave );

var buttonDownload = document.createElement( 'a' );
buttonDownload.className = 'button';
buttonDownload.style.display = 'none';
buttonDownload.download = 'index.html';
buttonDownload.textContent = 'download';
menu.appendChild( buttonDownload );

var buttonShare = document.createElement( 'button' );
buttonShare.className = 'button';
buttonShare.textContent = 'share';
buttonShare.addEventListener( 'click', function ( event ) {

  var dom = document.createElement( 'input' );
  var location = window.location;

  dom.value = location.origin + location.pathname + '#B/' + encode( codemirror.getValue() );
  dom.style.width = '400px';
  dom.style.padding = '5px';
  dom.style.marginTop = '20px';
  dom.style.border = '0px';

  popup.set( dom );
  popup.show();

  dom.focus();
  dom.select();

}, false );
menu.appendChild( buttonShare );

var buttonReset = document.createElement( 'button' );
buttonReset.className = 'button';
buttonReset.textContent = 'reset';
buttonReset.addEventListener( 'click', function ( event ) {

  if ( confirm( 'Are you sure?' ) === true ) {

    codemirror.setValue( defaultValue );
    save();

  }

}, false );
menu.appendChild( buttonReset );

var buttonAbout = document.createElement( 'button' );
buttonAbout.className = 'button';
buttonAbout.textContent = 'about';
buttonAbout.addEventListener( 'click', function ( event ) {

  var dom = document.createElement( 'div' );
  dom.style.width = '400px';
  dom.style.padding = '5px';
  dom.style.border = '0px';
  dom.style.textAlign = 'center';
  dom.innerHTML = '<h1>EISENSCRIPT EDITOR<\/h1><a href="https://github.com/after12am/eisenscript-editor" target="_blank">Source code</a>.<br>Powered by <a href="http://codemirror.net/" target="_blank">CodeMirror ' + CodeMirror.version + '</a> and <a href="http://esprima.org/" target="_blank">Esprima ' + esprima.version + '</a>.';
  popup.set( dom );
  popup.show();

}, false );
menu.appendChild( buttonAbout );


// popup

var popup = ( function () {

  var scope = this;

  var element = document.getElementById( 'popup' );
  element.style.display = 'none';

  var buttonClose = ( function () {

    var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
    svg.setAttribute( 'width', 32 );
    svg.setAttribute( 'height', 32 );

    var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
    path.setAttribute( 'd', 'M 9,12 L 11,10 L 15,14 L 19,10 L 21,12 L 17,16 L 21,20 L 19,22 L 15,18 L 11,22 L 9,20 L 13,16' );
    path.setAttribute( 'fill', 'rgb(235,235,235)' );
    svg.appendChild( path );

    return svg;

  } )();

  buttonClose.style.position = 'absolute';
  buttonClose.style.top = '5px';
  buttonClose.style.right = '5px';
  buttonClose.style.cursor = 'pointer';
  buttonClose.addEventListener( 'click', function ( event ) {

    scope.hide();

  }, false );
  element.appendChild( buttonClose );

  var content = document.createElement( 'div' );
  element.appendChild( content );

  function update() {

    element.style.left = ( ( window.innerWidth - element.offsetWidth ) / 2 ) + 'px';
    element.style.top = ( ( window.innerHeight - element.offsetHeight ) / 2 ) + 'px';

  }

  window.addEventListener( 'load', update, false );
  window.addEventListener( 'resize', update, false );

  //

  this.show = function () {

    element.style.display = '';
    update();

  };

  this.hide = function () {

    element.style.display = 'none';

  };

  this.set = function ( value ) {

    while ( content.children.length > 0 ) {

      content.removeChild( content.firstChild );

    }

    content.appendChild( value );

  };

  return this;

} )();


// events

document.addEventListener( 'drop', function ( event ) {

  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[ 0 ];

  documents[ 0 ].filename = file.name;
  documents[ 0 ].filetype = file.type;

  var reader = new FileReader();

  reader.onload = function ( event ) {
    codemirror.setValue( event.target.result );

  };

  reader.readAsText( file );

}, false );

document.addEventListener( 'keydown', function ( event ) {

  if ( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ) {

    event.preventDefault();
    save();

  }

  if ( event.keyCode === 13 && ( event.ctrlKey === true || event.metaKey === true ) ) {

    update();

  }

  if ( event.keyCode === 27 ) {

    toggle();

  }

}, false );


// actions

function update() {

  var value = codemirror.getValue();

  if ( validate( value ) ) {

    // remove previous iframe

    if ( preview.children.length > 0 ) {

      preview.removeChild( preview.firstChild );

    }

    //

    var iframe = document.createElement( 'iframe' );
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    preview.appendChild( iframe );

    var content = iframe.contentDocument || iframe.contentWindow.document;

    // workaround for chrome bug
    // http://code.google.com/p/chromium/issues/detail?id=35980#c12
    // value = value.replace( '<script>', '<script>if ( window.innerWidth === 0 ) { window.innerWidth = parent.innerWidth; window.innerHeight = parent.innerHeight; }' );
    container = container.replace( '<script>', '<script>if ( window.innerWidth === 0 ) { window.innerWidth = parent.innerWidth; window.innerHeight = parent.innerHeight; }' );
    // console.log(value)
    value = container.replace('%s', value);
    content.open();
    content.write( value );
    content.close();

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('doAnimate')) {
      iframe.contentWindow.document.getElementById('doAnimate').setAttribute('data', +urlParams.get('doAnimate'));
    }
    if (urlParams.has('doOptimize')) {
      iframe.contentWindow.document.getElementById('doOptimize').setAttribute('data', +urlParams.get('doOptimize'));
    }
    if (urlParams.has('docsite')) {
      iframe.contentWindow.document.getElementById('docsite').setAttribute('data', +urlParams.get('docsite'));
    }
    if (urlParams.has('wireframe')) {
      iframe.contentWindow.document.getElementById('wireframe').setAttribute('data', +urlParams.get('wireframe'));
    }
  }
}

var errorLines = [];
var widgets = [];

function validate( value ) {

  return codemirror.operation( function () {

    while ( errorLines.length > 0 ) {

      codemirror.removeLineClass( errorLines.shift(), 'background', 'errorLine' );

    }

    for ( var i = 0; i < widgets.length; i ++ ) {

      codemirror.removeLineWidget( widgets[ i ] );

    }

    widgets.length = 0;

    // remove html

    var string = '\n';
    var lines = value.split( '\n' );
    var lineCurrent = 0, lineTotal = lines.length;

    while ( lineCurrent < lineTotal && lines[ lineCurrent ].indexOf( '<script>' ) === -1 ) {

      string += '\n';
      lineCurrent ++;

    }

    var lineStart = lineCurrent ++;

    while ( lineCurrent < lineTotal && lines[ lineCurrent ].indexOf( '<\/script>' ) === -1 ) {

      string += lines[ lineCurrent ] + '\n';
      lineCurrent ++;

    }

    //

    try {

      var result = esprima.parse( string, { tolerant: true } ).errors;

      for ( var i = 0; i < result.length; i ++ ) {

        var error = result[ i ];

        var message = document.createElement( 'div' );
        message.className = 'esprima-error';
        message.textContent = error.message.replace(/Line [0-9]+: /, '');

        var lineNumber = error.lineNumber - 1;
        errorLines.push( lineNumber );

        codemirror.addLineClass( lineNumber, 'background', 'errorLine' );

        var widget = codemirror.addLineWidget(
          lineNumber,
          message
        );

        widgets.push( widget );

      }

    } catch ( error ) {

      var message = document.createElement( 'div' );
      message.className = 'esprima-error';
      message.textContent = error.message.replace(/Line [0-9]+: /, '');

      var lineNumber = error.lineNumber - 1;
      errorLines.push( lineNumber );

      codemirror.addLineClass( lineNumber, 'background', 'errorLine' );

      var widget = codemirror.addLineWidget(
        lineNumber,
        message
      );

      widgets.push( widget );

    }

    return errorLines.length === 0;

  });

}

function save() {

  documents[ 0 ].code = codemirror.getValue();

  localStorage.codeeditor = JSON.stringify( documents );

  var blob = new Blob( [ codemirror.getValue() ], { type: documents[ 0 ].filetype } );
  var objectURL = URL.createObjectURL( blob );

  buttonDownload.href = objectURL;

  var date = new Date();
  buttonDownload.download = documents[ 0 ].filename;

  buttonSave.style.display = 'none';
  buttonDownload.style.display = '';

}

function toggle() {

  if ( editor.style.display === '' ) {

    buttonHide.textContent = 'show code';

    editor.style.display = 'none';
    buttonUpdate.style.display = 'none';
    buttonShare.display = 'none';

  } else {

    buttonHide.textContent = 'hide code';

    editor.style.display = '';
    buttonUpdate.style.display = '';
    buttonShare.display = '';

  }

}

// hide show-code
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('show')) {
  if (+urlParams.get('show') === 0) {
    toggle();
  }
}

update();
