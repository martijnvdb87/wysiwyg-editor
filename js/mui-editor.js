window.MUIeditor = {
    current: false,

    ini: function() {
        this.events();
        this.update();
    },

    events: function() {
        var _this = this;

        $( document ).on( 'focus', '.mui-editor', function( e ) {
            _this.current = this;
        });

        $( document ).on( 'blur', '.mui-editor', function( e ) {
            _this.current = false;
        });

        $( document ).on( 'paste', '.mui-editor .mui-editor-content', function( e ) {
            var clipboardData, pastedData;

            e.stopPropagation();
            e.preventDefault();

            clipboardData = e.originalEvent.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData( 'text/html' );

            var pasteContent = $( '<div />' );
            pasteContent.html( pastedData );

            pasteContent.find( '*' );
        });



        $( document ).on( 'keydown', '.mui-editor .mui-editor-content', function( e ) {
            switch( e.which ) {
                case 8:
                    var path = _this.getCaretPath();

                    if( path.length == 2 ) {
                        if(
                            path[ 0 ].tagName == 'LI' &&
                            path[ 1 ].tagName == 'UL' &&
                            path[ 0 ].innerText == ''
                        ) {
                            e.preventDefault();
                            var block = $( '<p />' );
                            $( path[ 1 ] ).after( block );
                            block.html( '-&nbsp;' );
                            block.focus();
                            _this.moveCaret( block[ 0 ], 2 );
                            $( path[ 1 ] ).remove();

                        } else if(
                            path[ 0 ].tagName == 'LI' &&
                            path[ 1 ].tagName == 'OL' &&
                            path[ 0 ].innerText == ''
                        ) {
                            e.preventDefault();
                            var block = $( '<p />' );
                            $( path[ 1 ] ).after( block );
                            block.html( '1.&nbsp;' );
                            block.focus();
                            _this.moveCaret( block[ 0 ], 3 );
                            $( path[ 1 ] ).remove();

                        }
                    }

                    break;

                case 9:
                    e.preventDefault();
                    var path = _this.getCaretPath();

                    if( path.length > 0 ) {
                        if( path[ 0 ].tagName == 'LI' ) {
                            if( e.shiftKey ) {
                                if(
                                    path.length > 1 &&
                                    path[ ( path.length - 2 ) ].tagName == 'LI' && (
                                        path[ ( path.length - 1 ) ].tagName == 'UL' ||
                                        path[ ( path.length - 1 ) ].tagName == 'OL'
                                    )
                                ) {
                                    document.execCommand( 'outdent', false, null );
                                    document.execCommand( 'formatBlock', false, 'p' );

                                } else {
                                    document.execCommand( 'outdent', false, null );
                                }

                            } else if(
                                path[ 0 ].tagName == 'LI' && (
                                    path[ 1 ].tagName == 'UL' ||
                                    path[ 1 ].tagName == 'OL'
                                )
                            ) {
                                document.execCommand( 'indent', false, null );
                            }

                        } else if( path[ 0 ].tagName == 'P' ) {
                            var list = $( '<ul />' );
                            var listItem = $( '<li />' );
                            list.append( listItem );
                            $( path[ 0 ] ).after( list );
                            listItem.html( path[ 0 ].innerHTML );
                            listItem.focus();
                            _this.moveCaret( listItem[ 0 ], 0 );
                            $( path[ 0 ] ).remove();
                        }
                    }
                    break;
                case 13:
                    path = _this.getCaretPath();

                    if(
                        path &&
                        path.length > 0
                    ) {
                        var shortcodes = [
                            [ '/h1', 'h1' ],
                            [ '/h2', 'h2' ],
                            [ '/h3', 'h3' ],
                            [ '/h4', 'h4' ],
                            [ '/h5', 'h5' ],
                            [ '/h6', 'h6' ],
                            [ '/code', 'pre' ]
                        ];

                        var useShortcode = false;

                        for( var i = 0; i < shortcodes.length; i++ ) {
                            if( path[ 0 ].innerHTML == shortcodes[ i ][ 0 ] ) {
                                useShortcode = shortcodes[ i ];
                                break;
                            }
                        }

                        if( useShortcode ) {
                            e.preventDefault();
                            document.execCommand( 'formatBlock', false, useShortcode[ 1 ] );
                            path = _this.getCaretPath();
                            path[ 0 ].innerHTML = '<br />';
                            _this.moveCaret( path[ 0 ], 0 );

                        } else {
                            var topElement = path[ ( path.length - 1 ) ];
                            
                            var disableEnter = [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE' ];

                            for( var i = 0; i < disableEnter.length; i++ ) {
                                if( topElement.nodeName == disableEnter[ i ] ) {
                                    if( !e.shiftKey ) {
                                        e.preventDefault();
                                        var newElement = $( '<p></p>' );
                                        newElement.html( '<br />' );
                                        $( topElement ).after( newElement );
                                        newElement.focus();
                                        _this.moveCaret( newElement[ 0 ], 0 );
                                    }
                                    i = disableEnter.length;
                                }
                            }
                            
                        }
                    }
                    break;

                case 32:
                    var path = _this.getCaretPath();

                    if( path.length == 1 ) {
                        if( path[ 0 ].innerHTML == '-' ) {
                            e.preventDefault();
                            var list = $( '<ul />' );
                            var listItem = $( '<li />' );
                            list.append( listItem );
                            $( path[ 0 ] ).after( list );
                            listItem.focus();
                            _this.moveCaret( listItem[ 0 ], 0 );
                            $( path[ 0 ] ).remove();
            
                        } else if( path[ 0 ].innerHTML == '1.' ) {
                            e.preventDefault();
                            var list = $( '<ol />' );
                            var listItem = $( '<li />' );
                            list.append( listItem );
                            $( path[ 0 ] ).after( list );
                            listItem.focus();
                            _this.moveCaret( listItem[ 0 ], 0 );
                            $( path[ 0 ] ).remove();

                        }
                    }
                    
                    break;
            }
        });

        $( document ).on( 'keypress', '.mui-editor .mui-editor-content', function( e ) {
            var editor = $( this ).closest( '.mui-editor' );
            var previousCharacter = _this.getCharacterPrecedingCaret( editor[ 0 ] );

            var isSuper = false;
            var keyPress = false;
            var keyReplace = false;            

            switch( previousCharacter ) {
                case '^':
                case '⁰':
                case '¹':
                case '²':
                case '³':
                case '⁴':
                case '⁵':
                case '⁶':
                case '⁷':
                case '⁸':
                case '⁹':
                    isSuper = true;
                    break;
            }

            switch( e.which ) {
                case 48:
                    keyPress = e.which;
                    keyReplace = '⁰';
                    break;

                case 49:
                    keyPress = e.which;
                    keyReplace = '¹';
                    break;

                case 50:
                    keyPress = e.which;
                    keyReplace = '²';
                    break;

                case 51:
                    keyPress = e.which;
                    keyReplace = '³';
                    break;

                case 52:
                    keyPress = e.which;
                    keyReplace = '⁴';
                    break;

                case 53:
                    keyPress = e.which;
                    keyReplace = '⁵';
                    break;

                case 54:
                    keyPress = e.which;
                    keyReplace = '⁶';
                    break;

                case 55:
                    keyPress = e.which;
                    keyReplace = '⁷';
                    break;

                case 56:
                    keyPress = e.which;
                    keyReplace = '⁸';
                    break;

                 case 57:
                    keyPress = e.which;
                    keyReplace = '⁹';
                    break;
            }

            if( isSuper && keyPress ) {
                e.preventDefault();
                if( previousCharacter == '^' ) {
                    document.execCommand( 'delete', false, null );
                }
                document.execCommand( 'insertHTML', false, keyReplace );
            }
        });

        $( document ).on( 'input', '.mui-editor .mui-editor-content', function( e ) {
            _this.checkInput( $( this ).closest( '.mui-editor' )[ 0 ] );
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor-toolbar-button.mui-editor-toolbar-button-bold', function( e ) {
            document.execCommand( 'bold', false, null );
            _this.updateToolbar();
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor-toolbar-button.mui-editor-toolbar-button-italic', function( e ) {
            document.execCommand( 'italic', false, null );
            _this.updateToolbar();
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor-toolbar-button.mui-editor-toolbar-button-underline', function( e ) {
            document.execCommand( 'underline', false, null );
            _this.updateToolbar();
        });
        
        $( document ).on( 'mousedown touchstart', '.mui-editor-toolbar-button.mui-editor-toolbar-button-code', function( e ) {
            var path = _this.getCaretPath();
            var codeElement = false;
            
            if(
                path &&
                path.length > 1
            ) {
                for( var i = 0; i < path.length; i++ ) {
                    if( path[ i ].nodeName == 'CODE' ) {
                        codeElement = path[ i ];
                        break;
                    }
                }
            }

            if( codeElement ) {
                var content = codeElement.innerHTML;
                var textNode = document.createTextNode( content );
                $( codeElement ).after( textNode );
                $( codeElement ).remove();
                _this.selectElement( textNode );


            } else {
                document.execCommand( 'createLink', false, 'mui-editor-temp-element' );
                var sel = $( 'a[ href="mui-editor-temp-element" ]' );

                var codeElement = $( '<code>' + sel.text() + '</code>' );
                sel.after( codeElement );
                sel.remove();

                _this.selectElement( codeElement[ 0 ].childNodes[ 0 ] );

                _this.updateToolbar();
            }
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor .mui-editor-toolbar-button.mui-editor-toolbar-button-link', function( e ) {
            e.stopPropagation();
            e.preventDefault();

            var editor = $( this ).closest( '.mui-editor' );

            var selectedText = _this.getSelectedHtml();
            var contentData = _this.getContentData();

            var foundElement = false;
            for( var i = 0; i < contentData.withinElements.length; i++ ) {
                if( contentData.withinElements[ i ].nodeName == 'A' ) {
                    foundElement = contentData.withinElements[ i ];
                    break;
                }
            }

            if( contentData.buttonBold ) {
                selectedText = '<b>' + selectedText + '</b>';
            }

            if( contentData.buttonItalic ) {
                selectedText = '<i>' + selectedText + '</i>';
            }

            if( contentData.buttonUnderline ) {
                selectedText = '<u>' + selectedText + '</u>';
            }


            if( !foundElement ) {
                $( _this.current ).addClass( 'mui-editor-edit-link' );
                document.execCommand( 'insertHTML', false, '<span class="mui-editor-content-edit-link">' + selectedText + '</span>' );
                $( _this.current ).find( '.mui-editor-toolbar-container-edit-link input' ).attr( 'data-mui-editor-current', '' );

            } else {
                $( _this.current ).addClass( 'mui-editor-edit-link' );
                $( foundElement ).addClass( 'mui-editor-content-edit-link' );
                var url = $( foundElement ).attr( 'href' );
                $( _this.current ).find( '.mui-editor-toolbar-container-edit-link input' ).val( url );
                $( _this.current ).find( '.mui-editor-toolbar-container-edit-link input' ).attr( 'data-mui-editor-current', url );
            }

            editor.removeClass( 'mui-editor-selecting' );

            $( _this.current ).find( '.mui-editor-toolbar-container-edit-link input' ).select();
                
            var content = editor.find( '.mui-editor-content' );
            content[ 0 ].normalize();
        });

        $( document ).on( 'mousedown touchstart keyup keydown mouseup touchend', '.mui-editor-toolbar .mui-editor-toolbar-container-edit-link input', function( e ) {
            e.stopPropagation();
        });

        $( document ).on( 'blur', '.mui-editor .mui-editor-toolbar .mui-editor-toolbar-container-edit-link input', function( e ) {
            var input = $( this );
            var value = input.val();
            var editor = input.closest( '.mui-editor' );
            var content = editor.find( '.mui-editor-content' );

            var selected = content.find( '.mui-editor-content-edit-link' );
            var selectedHtml = selected.html();

            if( value != '' ) {
                selectedHtml = '<a href="' + value + '" rel="noopener noreferrer">' + selectedHtml + '</a>';
            }

            selected.after( selectedHtml );
            selected.remove();

            editor.removeClass( 'mui-editor-edit-link' );
            input.val( '' );

            content[ 0 ].normalize();
        });

        $( document ).on( 'keydown', '.mui-editor .mui-editor-toolbar .mui-editor-toolbar-container-edit-link input', function( e ) {
            if( e.which == 13 ) {
                e.preventDefault();
                e.stopPropagation();
                $( this ).blur();

            } else if( e.which == 9 ) {
                e.preventDefault();
                e.stopPropagation();
                $( this ).val( '' ).blur();

            } else if( e.which == 27 ) {
                e.preventDefault();
                e.stopPropagation();
                $( this ).val( $( this ).attr( 'data-mui-editor-current' ) ).blur();
            }
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor .mui-editor-toolbar-button.mui-editor-toolbar-button-h2', function( e ) {
            var type = $( this ).attr( 'data-mui-editor-toolbar-button' );

            if( type == 'H2' ) {
                document.execCommand( 'formatBlock', false, 'P' );
                $( this ).attr( 'data-mui-editor-toolbar-button', 'P' );

            } else {
                document.execCommand( 'formatBlock', false, 'H2' );
                $( this ).attr( 'data-mui-editor-toolbar-button', 'H2' );
            }

            var editor = $( this ).closest( '.mui-editor' )[ 0 ];
            _this.updateToolbar();
            _this.checkInput( editor );
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor .mui-editor-toolbar-button.mui-editor-toolbar-button-h3', function( e ) {
            var type = $( this ).attr( 'data-mui-editor-toolbar-button' );

            if( type == 'H3' ) {
                document.execCommand( 'formatBlock', false, 'P' );
                $( this ).attr( 'data-mui-editor-toolbar-button', 'P' );

            } else {
                document.execCommand( 'formatBlock', false, 'H3' );
                $( this ).attr( 'data-mui-editor-toolbar-button', 'H3' );
            }

            var editor = $( this ).closest( '.mui-editor' )[ 0 ];
            _this.updateToolbar();
            _this.checkInput( editor );
        });

        $( document ).on( 'keyup keydown mouseup touchend', function( e ) {
            setTimeout( function() {
                _this.updateToolbar();
            });
        });

        $( document ).on( 'mousedown touchstart', '.mui-editor .mui-editor-toolbar', function( e ) {
            e.preventDefault();
            e.stopPropagation();
        });
    },

    getContentData: function() {
        var contentData = {};
        contentData.emptyElement = false;

        contentData.inline = [];
        contentData.block = [];

        contentData.inlineTypes = [];
        contentData.blockTypes = [];

        contentData.withinElements = [];

        contentData.selectBox = false;

        s = window.getSelection();
        if( s.anchorNode ) {
            oRange = s.getRangeAt( 0 );
            oRect = oRange.getBoundingClientRect();

            contentData.selectBox = {};
            contentData.selectBox.height = oRect.height;
            contentData.selectBox.left   = ( oRect.left + $( window ).scrollLeft() ) - $( this.current ).offset().left;
            contentData.selectBox.top    = ( oRect.top + $( window ).scrollTop() ) - $( this.current ).offset().top;
            contentData.selectBox.width  = oRect.width;
            contentData.selectBox.bottom = contentData.selectBox.top + contentData.selectBox.height;
            contentData.selectBox.right  = contentData.selectBox.left + contentData.selectBox.width;

            var elements = this.getSelectedNodes();

            for( var i = 0; i < elements.length; i++ ) {
                if( elements[ i ].nodeType == 3 ) {
                    elements[ i ] = elements[ i ].parentElement;
                }

                switch( elements[ i ].nodeName ) {
                    case 'B':
                    case 'I':
                    case 'U':
                    case 'A':
                    case 'CODE':
                        if( contentData.inline.indexOf( elements[ i ] ) < 0 ) {
                            contentData.inline.push( elements[ i ] );

                            if( contentData.inlineTypes.indexOf( elements[ i ].nodeName ) < 0 ) {
                                contentData.inlineTypes.push( elements[ i ].nodeName );
                            }
                        }

                        break;

                    case 'H1':
                    case 'H2':
                    case 'H3':
                    case 'H4':
                    case 'H5':
                    case 'H6':
                    case 'P':
                        if( contentData.block.indexOf( elements[ i ] ) < 0 ) {
                            contentData.block.push( elements[ i ] );

                            if( contentData.blockTypes.indexOf( elements[ i ].nodeName ) < 0 ) {
                                contentData.blockTypes.push( elements[ i ].nodeName );
                            }
                        }

                        break;
                }

                if( i == 0 ) {
                    contentData.withinElements = this.getNodePath( elements[ i ] );

                } else {
                    var elementPath = this.getNodePath( elements[ i ] );
                    var tempArray = contentData.withinElements.slice();
                    contentData.withinElements = [];

                    for( var x = 0; x < elementPath.length; x++ ) {
                        if( tempArray.indexOf( elementPath[ x ] ) > -1 ) {
                            contentData.withinElements.push( elementPath[ x ] );
                        }
                    }
                }
            }

            contentData.buttonBold = false;
            contentData.buttonItalic = false;
            contentData.buttonUnderline = false;
            contentData.buttonLink = false;
            contentData.buttonCode = false;
            contentData.buttonFormat = false;

            for( var i = 0; i < contentData.withinElements.length; i++ ) {
                if( contentData.withinElements[ i ].nodeName == 'B' ) {
                    contentData.buttonBold = true;
                }

                if( contentData.withinElements[ i ].nodeName == 'I' ) {
                    contentData.buttonItalic = true;
                }

                if( contentData.withinElements[ i ].nodeName == 'U' ) {
                    contentData.buttonUnderline = true;
                }

                if( contentData.withinElements[ i ].nodeName == 'A' ) {
                    contentData.buttonLink = true;
                }

                if( contentData.withinElements[ i ].nodeName == 'CODE' ) {
                    contentData.buttonCode = true;
                }

                switch( contentData.withinElements[ i ].nodeName ) {
                    case 'H1':
                    case 'H2':
                    case 'H3':
                    case 'H4':
                    case 'H5':
                    case 'H6':
                    case 'P':
                        contentData.buttonFormat = contentData.withinElements[ i ].nodeName;
                        break;
                }
            }
        }

        return contentData;
    },

    updateToolbar() {
        if( this.current ) {
            this.createToolbar();
            var toolbar = $( this.current ).find( '.mui-editor-toolbar' );

            var contentData = this.getContentData();


            if( this.getSelectedText() != '' ) {
                $( this.current ).addClass( 'mui-editor-selecting' );

                if( contentData.buttonBold ) {
                    toolbar.find( '.mui-editor-toolbar-button-bold' ).addClass( 'mui-editor-toolbar-button-active' );
                } else {
                    toolbar.find( '.mui-editor-toolbar-button-bold' ).removeClass( 'mui-editor-toolbar-button-active' );
                }

                if( contentData.buttonItalic ) {
                    toolbar.find( '.mui-editor-toolbar-button-italic' ).addClass( 'mui-editor-toolbar-button-active' );
                } else {
                    toolbar.find( '.mui-editor-toolbar-button-italic' ).removeClass( 'mui-editor-toolbar-button-active' );
                }

                if( contentData.buttonUnderline ) {
                    toolbar.find( '.mui-editor-toolbar-button-underline' ).addClass( 'mui-editor-toolbar-button-active' );
                } else {
                    toolbar.find( '.mui-editor-toolbar-button-underline' ).removeClass( 'mui-editor-toolbar-button-active' );
                }

                if( contentData.buttonCode ) {
                    toolbar.find( '.mui-editor-toolbar-button-code' ).addClass( 'mui-editor-toolbar-button-active' );
                } else {
                    toolbar.find( '.mui-editor-toolbar-button-code' ).removeClass( 'mui-editor-toolbar-button-active' );
                }

                var acceptCurrentAnchor = true;

                for( var x = 0; x < contentData.inline.length; x++ ) {
                    if( contentData.inline[ x ].nodeName == 'A' ) {
                        acceptCurrentAnchor = false;

                        for( var i = 0; i < contentData.withinElements.length; i++ ) {
                            if( contentData.withinElements[ i ].nodeName == 'A' ) {
                                if( contentData.inline[ x ] == contentData.withinElements[ i ] ) {
                                    acceptCurrentAnchor = true;

                                } else {
                                    acceptCurrentAnchor = false;
                                    break;
                                }
                            }
                        }

                        break;
                    }
                }

                if( acceptCurrentAnchor ) {
                    toolbar.find( '.mui-editor-toolbar-button-link' ).removeClass( 'mui-editor-toolbar-button-hide' );

                    if( contentData.buttonLink ) {
                        toolbar.find( '.mui-editor-toolbar-button-link' ).addClass( 'mui-editor-toolbar-button-active' );
                    } else {
                        toolbar.find( '.mui-editor-toolbar-button-link' ).removeClass( 'mui-editor-toolbar-button-active' );
                    }

                } else {
                    toolbar.find( '.mui-editor-toolbar-button-link' ).addClass( 'mui-editor-toolbar-button-hide' );
                }

                if( contentData.buttonFormat ) {
                    toolbar.find( '.mui-editor-toolbar-button-h2, .mui-editor-toolbar-button-h3' ).removeClass( 'mui-editor-toolbar-button-hide' );

                    if( contentData.buttonFormat == 'H2' ) {
                        toolbar.find( '.mui-editor-toolbar-button-h2' ).addClass( 'mui-editor-toolbar-button-active' );
                    } else {
                        toolbar.find( '.mui-editor-toolbar-button-h2' ).removeClass( 'mui-editor-toolbar-button-active' );
                    }

                    if( contentData.buttonFormat == 'H3' ) {
                        toolbar.find( '.mui-editor-toolbar-button-h3' ).addClass( 'mui-editor-toolbar-button-active' );
                    } else {
                        toolbar.find( '.mui-editor-toolbar-button-h3' ).removeClass( 'mui-editor-toolbar-button-active' );
                    }
                } else {
                    toolbar.find( '.mui-editor-toolbar-button-h2, .mui-editor-toolbar-button-h3' ).addClass( 'mui-editor-toolbar-button-hide' );
                }


            } else {
                $( this.current ).removeClass( 'mui-editor-selecting' );
                var path = this.getCaretPath();

                if( path.length == 1 ) {
                    if( path[ 0 ] ) {
                        if( $( path[ 0 ] ).text() == '' ) {
                            contentData.emptyElement = true;
                        }
                    }
                }
            }

            if( contentData.selectBox ) {
                var selectedCenter = contentData.selectBox.left + ( contentData.selectBox.width / 2 );
                var toolbarLeft = selectedCenter - ( toolbar.outerWidth() / 2 );

                toolbar.css( 'left', toolbarLeft + 'px' );
                toolbar.css( 'top', ( contentData.selectBox.top - toolbar.outerHeight() ) + 'px' );
            }
        }
    },

    createToolbar() {
        if(
            this.current &&
            $( this.current ).find( '.mui-editor-toolbar' ).length == 0
        ) {
            var toolbar = $( '<div />' );
            toolbar.addClass( 'mui-editor-toolbar' );

            var toolbarContainer = $( '<div />' );
            toolbarContainer.addClass( 'mui-editor-toolbar-container' );
            toolbar.append( toolbarContainer );

            var toolbarButtons = $( '<div />' );
            toolbarButtons.addClass( 'mui-editor-toolbar-container-buttons' );
            toolbarContainer.append( toolbarButtons );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-bold' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>' );
            toolbarButtons.append( button );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-italic' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>' );
            toolbarButtons.append( button );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-underline' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>' );
            toolbarButtons.append( button );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-link' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>' );
            toolbarButtons.append( button );
            toolbarButtons.append( button );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-code' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>' );
            toolbarButtons.append( button );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-h2' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>' );
            toolbarButtons.append( button );

            var button = $( '<button />' );
            button.addClass( 'mui-editor-toolbar-button mui-editor-toolbar-button-h3' );
            button.append( '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M16 7L7 7L7 10L10 10L10 17L13 17L13 10L16 10L16 7z"/></svg>' );
            toolbarButtons.append( button );

            var toolbarEditLink = $( '<div />' );
            toolbarEditLink.addClass( 'mui-editor-toolbar-container-edit-link' );
            toolbarContainer.append( toolbarEditLink );

            var editLinkInput = $( '<input type="text" />' );

            var placeholder = $( this.current ).attr( 'data-mui-editor-toolbar-link-placeholder' );
            editLinkInput.attr( 'placeholder', placeholder );
            toolbarEditLink.append( editLinkInput );           

            $( this.current ).prepend( toolbar );
        }
    },

    update: function() {
        $( '.mui-editor' ).each( function( e ) {
            var editor = $( this );

            editor.find( '.mui-editor-content' ).each( function() {
                var content = $( this );
                content.attr( 'contenteditable', 'true' );
                content.trigger( 'input' );
            });
        });
    },

    getCharacterPrecedingCaret: function( containerEl ) {
        var precedingChar = '', sel, range, precedingRange;
        if( window.getSelection ) {
            sel = window.getSelection();

            if( sel.rangeCount > 0 ) {
                range = sel.getRangeAt( 0 ).cloneRange();
                range.collapse( true );
                range.setStart( containerEl, 0);
                precedingChar = range.toString().slice( -1 );
            }

        } else if( ( sel = document.selection ) && sel.type != 'Control' ) {
            range = sel.createRange();
            precedingRange = range.duplicate();
            precedingRange.moveToElementText( containerEl );
            precedingRange.setEndPoint( 'EndToStart', range);
            precedingChar = precedingRange.text.slice( -1 );
        }
        return precedingChar;
    },

    checkInput: function( editor ) {
        var editor = $( editor );
        var content = editor.find( '.mui-editor-content' );

        content[ 0 ].normalize();


        if( content.html() == '' ) {
            content.html( '<p><br /></p>' );
        }

        var path = this.getCaretPath();

        if( path.length == 1 ) {
            if( path[ 0 ].tagName == 'DIV' ) {
                document.execCommand( 'formatBlock', false, 'p' );

            }
        }
    },

    getNodePath: function( node ) {
        var path = [];
        if( node.nodeType == 1 ) {
            path.push( node );
        }

        var parent = node.parentElement;
        while( parent ) {
            if( parent.classList.contains( 'mui-editor-content' ) ) {
                break;
            }
            path.push( parent );
            parent = parent.parentElement;
        }

        return path;
    },


    getSelectedText: function() {
        var text = '';
        if( typeof window.getSelection != 'undefined' ) {
            text = window.getSelection().toString();
        } else if( typeof document.selection != 'undefined' && document.selection.type == 'Text' ) {
            text = document.selection.createRange().text;
        }

        return text;
    },

    getSelectedHtml: function() {
        var range;
        if( document.selection && document.selection.createRange ) {
            range = document.selection.createRange();
            return range.htmlText;

        } else if( window.getSelection ) {
            var selection = window.getSelection();
            if( selection.rangeCount > 0 ) {
                range = selection.getRangeAt( 0 );
                var clonedSelection = range.cloneContents();
                var div = document.createElement( 'div' );
                div.appendChild( clonedSelection );
                return div.innerHTML;

            } else {
                return '';
            }

        } else {
            return '';
        }
    },

    getCaretPath: function() {
        var accept = false;
        var currentPath = false;

        var parentEl = null, sel;
        if( window.getSelection ) {
            sel = window.getSelection();
            if( sel.rangeCount ) {
                parentEl = sel.getRangeAt( 0 ).commonAncestorContainer;
                if( parentEl.nodeType != 1 ) {
                    parentEl = parentEl.parentNode;
                }
            }

        } else if( ( sel = document.selection ) && sel.type != 'Control' ) {
            parentEl = sel.createRange().parentElement();
        }

        var path = [];

        path.push( parentEl );

        if( !$( parentEl ).hasClass( 'mui-editor-content' ) ) {
            $( parentEl ).parents().each( function() {
                if( $( this ).hasClass( 'mui-editor-content' ) ) {
                    accept = true;
                    return false;
                }
                path.push( this );
            });
        }

        if( accept ) {
            currentPath = path;
        }

        return currentPath;
    },

    nextNode: function(node) {
        if( node.hasChildNodes() ) {
            return node.firstChild;

        } else {
            while( node && !node.nextSibling ) {
                node = node.parentNode;
            }
            if( !node ) {
                return null;
            }

            return node.nextSibling;
        }
    },

    getRangeSelectedNodes: function(range) {
        var node = range.startContainer;
        var endNode = range.endContainer;

        if( node == endNode ) {
            return [ node ];
        }

        var rangeNodes = [];
        while( node && node != endNode ) {
            rangeNodes.push( node = this.nextNode( node ) );
        }

        node = range.startContainer;
        while( node && node != range.commonAncestorContainer ) {
            rangeNodes.unshift( node );
            node = node.parentNode;
        }
        return rangeNodes;
    },

    getSelectedNodes: function() {
        if( window.getSelection ) {
            var sel = window.getSelection();
            if( !sel.isCollapsed ) {
                return this.getRangeSelectedNodes( sel.getRangeAt( 0 ) );
            }
        }
        return [];
    },

    findElementNodes: function( element ) {
        if(
            element.childNodes &&
            element.childNodes.length > 0
        ) {
            for( var i = 0; i < element.childNodes.length; i++ ) {
                this.findElementNodes( element.childNodes[ i ] );
            }
        } else {
            this.tempNodesInElement.push( element );
        }
    },

    moveCaret: function( element, position ) {
        var count = 0;
        this.tempNodesInElement = [];

        this.findElementNodes( element );

        var count = 0;
        var foundElement = false;

        for( var i = 0; i < this.tempNodesInElement.length; i++ ) {
            var elementLength = 0;

            if(
                !(
                    this.tempNodesInElement[ i ].innerText == '' ||
                    this.tempNodesInElement[ i ].innerText == null
                )
            ) {
                elementLength = this.tempNodesInElement[ i ].innerText.length;
            }

            if( elementLength + count <= position ) {
                foundElement = this.tempNodesInElement[ i ];
                break;
            }
        }

        this.tempNodesInElement = undefined;

        if( foundElement ) {
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart( foundElement, ( position - count ) );
            range.collapse( true );
            sel.removeAllRanges();
            sel.addRange( range );
        }
    },

    selectElement: function( el ) {
        var range = document.createRange();
        range.selectNodeContents( el );
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange( range );
    }


};

window.MUIeditor.ini();
