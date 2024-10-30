(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var HandleAddDuplicateBehavior;

HandleAddDuplicateBehavior = Marionette.Behavior.extend( {

	onChildviewClickNew: function( childView ) {
		var currentIndex = childView.$el.index() + 1;

		this.addChild( { at: currentIndex } );
	},

	onRequestNew: function() {
		this.addChild();
	},

	addChild: function( options ) {
		if ( this.view.isCollectionFilled() ) {
			return;
		}

		options = options || {};

		var newItem = {
			id: kitbuilder.helpers.getUniqueID(),
			elType: this.view.getChildType()[0],
			settings: {},
			elements: []
		};

		this.view.addChildModel( newItem, options );
	}
} );

module.exports = HandleAddDuplicateBehavior;

},{}],2:[function(require,module,exports){
var HandleDuplicateBehavior;

HandleDuplicateBehavior = Marionette.Behavior.extend( {

	onChildviewRequestDuplicate: function( childView ) {
		if ( this.view.isCollectionFilled() ) {
			return;
		}

		var currentIndex = this.view.collection.indexOf( childView.model ),
			newModel = childView.model.clone();

		this.view.addChildModel( newModel, { at: currentIndex + 1 } );
	}
} );

module.exports = HandleDuplicateBehavior;

},{}],3:[function(require,module,exports){
var InnerTabsBehavior;

InnerTabsBehavior = Marionette.Behavior.extend( {

	onRenderCollection: function() {
		this.handleInnerTabs( this.view );
	},

	handleInnerTabs: function( parent ) {
		var closedClass = 'kitbuilder-tab-close',
			activeClass = 'kitbuilder-tab-active',
			tabsWrappers = parent.children.filter( function( view ) {
				return 'tabs' === view.model.get( 'type' );
			} );

			_.each( tabsWrappers, function( view ) {
				view.$el.find( '.kitbuilder-control-content' ).remove();

				var tabsId = view.model.get( 'name' ),
				tabs = parent.children.filter( function( childView ) {
					return ( 'tab' === childView.model.get( 'type' ) && childView.model.get( 'tabs_wrapper' ) === tabsId );
				} );

				_.each( tabs, function( childView, index ) {
					view._addChildView( childView );

					var tabId = childView.model.get( 'name' ),
					controlsUnderTab = parent.children.filter( function( view ) {
						return ( tabId === view.model.get( 'inner_tab' ) );
					} );

					if ( 0 === index ) {
						childView.$el.addClass( activeClass );
					} else {
						_.each( controlsUnderTab, function( view ) {
							view.$el.addClass( closedClass );
						} );
					}
				} );
			} );
	},

	onChildviewControlTabClicked: function( childView ) {
		var closedClass = 'kitbuilder-tab-close',
			activeClass = 'kitbuilder-tab-active',
			tabClicked = childView.model.get( 'name' ),
			childrenUnderTab = this.view.children.filter( function( view ) {
				return ( 'tab' !== view.model.get( 'type' ) && childView.model.get( 'tabs_wrapper' ) === view.model.get( 'tabs_wrapper' ) );
			} ),
			siblingTabs = this.view.children.filter( function( view ) {
				return ( 'tab' === view.model.get( 'type' ) && childView.model.get( 'tabs_wrapper' ) === view.model.get( 'tabs_wrapper' ) );
			} );

			_.each( siblingTabs, function( view ) {
				view.$el.removeClass( activeClass );
			} );

			childView.$el.addClass( activeClass );

			_.each( childrenUnderTab, function( view ) {
				if ( view.model.get( 'inner_tab' ) === tabClicked ) {
					view.$el.removeClass( closedClass );
				} else {
					view.$el.addClass( closedClass );
				}
			} );

			kitbuilder.channels.data.trigger( 'scrollbar:update' );
	}
} );

module.exports = InnerTabsBehavior;

},{}],4:[function(require,module,exports){
var ResizableBehavior;

ResizableBehavior = Marionette.Behavior.extend( {
	defaults: {
		handles: kitbuilder.config.is_rtl ? 'w' : 'e'
	},

	ui: {
		columnTitle: '.column-title'
	},

	events: {
		resizestart: 'onResizeStart',
		resizestop: 'onResizeStop',
		resize: 'onResize'
	},

	initialize: function() {
		Marionette.Behavior.prototype.initialize.apply( this, arguments );

		this.listenTo( kitbuilder.channels.dataEditMode, 'switch', this.onEditModeSwitched );
	},

	active: function() {
		this.deactivate();

		var options = _.clone( this.options );

		delete options.behaviorClass;

		var $childViewContainer = this.getChildViewContainer(),
			defaultResizableOptions = {},
			resizableOptions = _.extend( defaultResizableOptions, options );

		$childViewContainer.resizable( resizableOptions );
	},

	deactivate: function() {
		if ( this.getChildViewContainer().resizable( 'instance' ) ) {
			this.getChildViewContainer().resizable( 'destroy' );
		}
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' === activeMode ) {
			this.active();
		} else {
			this.deactivate();
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			self.onEditModeSwitched( kitbuilder.channels.dataEditMode.request( 'activeMode' ) );
		} );
	},

	onDestroy: function() {
		this.deactivate();
	},

	onResizeStart: function( event ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize:start' );
	},

	onResizeStop: function( event ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize:stop' );
	},

	onResize: function( event, ui ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize', ui );
	},

	getChildViewContainer: function() {
		return this.$el;
	}
} );

module.exports = ResizableBehavior;

},{}],5:[function(require,module,exports){
var SortableBehavior;

SortableBehavior = Marionette.Behavior.extend( {
	defaults: {
		elChildType: 'widget'
	},

	events: {
		'sortstart': 'onSortStart',
		'sortreceive': 'onSortReceive',
		'sortupdate': 'onSortUpdate',
		'sortstop': 'onSortStop',
		'sortover': 'onSortOver',
		'sortout': 'onSortOut'
	},

	initialize: function() {
		this.listenTo( kitbuilder.channels.dataEditMode, 'switch', this.onEditModeSwitched );
		this.listenTo( kitbuilder.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' === activeMode ) {
			this.active();
		} else {
			this.deactivate();
		}
	},

	onDeviceModeChange: function() {
		var deviceMode = kitbuilder.channels.deviceMode.request( 'currentMode' );

		if ( 'desktop' === deviceMode ) {
			this.active();
		} else {
			this.deactivate();
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			self.onEditModeSwitched( kitbuilder.channels.dataEditMode.request( 'activeMode' ) );
		} );
	},

	onDestroy: function() {
		this.deactivate();
	},

	active: function() {
		if ( this.getChildViewContainer().sortable( 'instance' ) ) {
			return;
		}

		var $childViewContainer = this.getChildViewContainer(),
			defaultSortableOptions = {
				connectWith: $childViewContainer.selector,
				cursor: 'move',
				placeholder: 'kitbuilder-sortable-placeholder',
				cursorAt: {
					top: 20,
					left: 25
				},
				helper: _.bind( this._getSortableHelper, this )
			},
			sortableOptions = _.extend( defaultSortableOptions, this.view.getSortableOptions() ),
            safeToSort = true;

        $childViewContainer.each(function () {
            if(typeof this.ownerDocument === 'undefined'){
                safeToSort = false;
            } else if(typeof this.ownerDocument.defaultView === 'undefined'){
                safeToSort = false;
            }
        });

        if(safeToSort){
            $childViewContainer.sortable( sortableOptions );
        }

	},

	_getSortableHelper: function( event, $item ) {
		var model = this.view.collection.get( {
			cid: $item.data( 'model-cid' )
		} );

		return '<div style="height: 84px; width: 125px;" class="kitbuilder-sortable-helper kitbuilder-sortable-helper-' + model.get( 'elType' ) + '"><div class="icon"><i class="' + model.getIcon() + '"></i></div><div class="kitbuilder-element-title-wrapper"><div class="title">' + model.getTitle() + '</div></div></div>';
	},

	deactivate: function() {
		if ( this.getChildViewContainer().sortable( 'instance' ) ) {
			this.getChildViewContainer().sortable( 'destroy' );
		}
	},

	onSortStart: function( event, ui ) {
		event.stopPropagation();

		var model = this.view.collection.get( {
			cid: ui.item.data( 'model-cid' )
		} );

		if ( 'column' === this.options.elChildType ) {
			// the following code is just for touch
			ui.placeholder.addClass( 'kitbuilder-column' );

			var uiData = ui.item.data( 'sortableItem' ),
				uiItems = uiData.items,
				itemHeight = 0;

			uiItems.forEach( function( item ) {
				if ( item.item[0] === ui.item[0] ) {
					itemHeight = item.height;
					return false;
				}
			} );

			ui.placeholder.height( itemHeight );

			// ui.placeholder.addClass( 'kitbuilder-column kitbuilder-col-' + model.getSetting( 'size' ) );
		}

		kitbuilder.channels.data.trigger( model.get( 'elType' ) + ':drag:start' );

		kitbuilder.channels.data.reply( 'cache:' + model.cid, model );
	},

	onSortOver: function( event, ui ) {
		event.stopPropagation();

		var model = kitbuilder.channels.data.request( 'cache:' + ui.item.data( 'model-cid' ) );

		Backbone.$( event.target )
			.addClass( 'kitbuilder-draggable-over' )
			.attr( {
				'data-dragged-element': model.get( 'elType' ),
				'data-dragged-is-inner': model.get( 'isInner' )
			} );

		this.$el.addClass( 'kitbuilder-dragging-on-child' );
	},

	onSortOut: function( event ) {
		event.stopPropagation();

		Backbone.$( event.target )
			.removeClass( 'kitbuilder-draggable-over' )
			.removeAttr( 'data-dragged-element data-dragged-is-inner' );

		this.$el.removeClass( 'kitbuilder-dragging-on-child' );
	},

	onSortReceive: function( event, ui ) {
		event.stopPropagation();

		if ( this.view.isCollectionFilled() ) {
			Backbone.$( ui.sender ).sortable( 'cancel' );
			return;
		}

		var model = kitbuilder.channels.data.request( 'cache:' + ui.item.data( 'model-cid' ) ),
			draggedElType = model.get( 'elType' ),
			draggedIsInnerSection = 'section' === draggedElType && model.get( 'isInner' ),
			targetIsInnerColumn = 'column' === this.view.getElementType() && this.view.isInner();

		if ( draggedIsInnerSection && targetIsInnerColumn ) {
			Backbone.$( ui.sender ).sortable( 'cancel' );
			return;
		}

		var newIndex = ui.item.parent().children().index( ui.item ),
			newModel = new this.view.collection.model( model.toJSON( { copyHtmlCache: true } ) );

		this.view.addChildModel( newModel, { at: newIndex } );

		kitbuilder.channels.data.trigger( draggedElType + ':drag:end' );

		model.destroy();
	},

	onSortUpdate: function( event, ui ) {
		event.stopPropagation();

		var model = this.view.collection.get( ui.item.attr( 'data-model-cid' ) );
		if ( model ) {
			kitbuilder.channels.data.trigger( model.get( 'elType' ) + ':drag:end' );
		}
	},

	onSortStop: function( event, ui ) {
		event.stopPropagation();

		var $childElement = ui.item,
			collection = this.view.collection,
			model = collection.get( $childElement.attr( 'data-model-cid' ) ),
			newIndex = $childElement.parent().children().index( $childElement );

		if ( this.getChildViewContainer()[0] === ui.item.parent()[0] ) {
			if ( null === ui.sender && model ) {
				var oldIndex = collection.indexOf( model );

				if ( oldIndex !== newIndex ) {
					var child = this.view.children.findByModelCid( model.cid );

					child._isRendering = true;

					collection.remove( model );

					this.view.addChildModel( model, { at: newIndex } );

					kitbuilder.setFlagEditorChange( true );
				}

				kitbuilder.channels.data.trigger( model.get( 'elType' ) + ':drag:end' );
			}
		}
	},

	onAddChild: function( view ) {
		view.$el.attr( 'data-model-cid', view.model.cid );
	},

	getChildViewContainer: function() {
		if ( 'function' === typeof this.view.getChildViewContainer ) {
			// CompositeView
			return this.view.getChildViewContainer( this.view );
		} else {
			// CollectionView
			return this.$el;
		}
	}
} );

module.exports = SortableBehavior;

},{}],6:[function(require,module,exports){
var RevisionModel = require( './model' );

module.exports = Backbone.Collection.extend( {
	model: RevisionModel
} );

},{"./model":9}],7:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-panel-revisions-no-revisions',

	id: 'kitbuilder-panel-revisions-no-revisions',

	className: 'kitbuilder-panel-nerd-box'
} );

},{}],8:[function(require,module,exports){
var RevisionsCollection = require( './collection' ),
	RevisionsPageView = require( './panel-page' ),
	RevisionsEmptyView = require( './empty-view' ),
	RevisionsManager;

RevisionsManager = function() {
	var self = this,
		revisions;

	var addPanelPage = function() {
		kitbuilder.getPanelView().addPage( 'revisionsPage', {
			getView: function() {
				if ( revisions.length ) {
					return RevisionsPageView;
				}

				return RevisionsEmptyView;
			},
			title: kitbuilder.translate( 'revision_history' ),
			options: {
				collection: revisions
			}
		} );
	};

	var onEditorSaved = function( data ) {
		if ( data.last_revision ) {
			self.addRevision( data.last_revision );
		}

		var revisionsToKeep = revisions.filter( function( revision ) {
			return -1 !== data.revisions_ids.indexOf( revision.get( 'id' ) );
		} );

		revisions.reset( revisionsToKeep );
	};

	var attachEvents = function() {
		kitbuilder.channels.editor.on( 'saved', onEditorSaved );
	};

	var addHotKeys = function() {
		var H_KEY = 72,
			UP_ARROW_KEY = 38,
			DOWN_ARROW_KEY = 40;

		var navigationHandler = {
			isWorthHandling: function() {
				var panel = kitbuilder.getPanelView();

				if ( 'revisionsPage' !== panel.getCurrentPageName() ) {
					return false;
				}

				var revisionsPage = panel.getCurrentPageView();

				return revisionsPage.currentPreviewId && revisionsPage.currentPreviewItem && revisionsPage.children.length > 1;
			},
			handle: function( event ) {
				kitbuilder.getPanelView().getCurrentPageView().navigate( UP_ARROW_KEY === event.which );
			}
		};

		kitbuilder.hotKeys.addHotKeyHandler( UP_ARROW_KEY, 'revisionNavigation', navigationHandler );

		kitbuilder.hotKeys.addHotKeyHandler( DOWN_ARROW_KEY, 'revisionNavigation', navigationHandler );

		kitbuilder.hotKeys.addHotKeyHandler( H_KEY, 'showRevisionsPage', {
			isWorthHandling: function( event ) {
				return kitbuilder.hotKeys.isControlEvent( event ) && event.shiftKey;
			},
			handle: function() {
				kitbuilder.getPanelView().setPage( 'revisionsPage' );
			}
		} );
	};

	this.addRevision = function( revisionData ) {
		revisions.add( revisionData, { at: 0 } );

		var panel = kitbuilder.getPanelView();

		if ( panel.getCurrentPageView() instanceof RevisionsEmptyView ) {
			panel.setPage( 'revisionsPage' );
		}
	};

	this.deleteRevision = function( revisionModel, options ) {
		var params = {
			data: {
				id: revisionModel.get( 'id' )
			},
			success: function() {
				if ( options.success ) {
					options.success();
				}

				revisionModel.destroy();

				if ( ! revisions.length ) {
					kitbuilder.getPanelView().setPage( 'revisionsPage' );
				}
			}
		};

		if ( options.error ) {
			params.error = options.error;
		}

		kitbuilder.ajax.send( 'delete_revision', params );
	};

	this.init = function() {
		revisions = new RevisionsCollection( kitbuilder.config.revisions );

		attachEvents();

		addHotKeys();

		kitbuilder.on( 'preview:loaded', addPanelPage );
	};
};

module.exports = new RevisionsManager();

},{"./collection":6,"./empty-view":7,"./panel-page":10}],9:[function(require,module,exports){
var RevisionModel;

RevisionModel = Backbone.Model.extend();

RevisionModel.prototype.sync = function() {
	return null;
};

module.exports = RevisionModel;

},{}],10:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend( {
	id: 'kitbuilder-panel-revisions',

	template: '#tmpl-kitbuilder-panel-revisions',

	childView: require( './view' ),

	childViewContainer: '#kitbuilder-revisions-list',

	ui: {
		discard: '.kitbuilder-panel-scheme-discard .kitbuilder-button',
		apply: '.kitbuilder-panel-scheme-save .kitbuilder-button'
	},

	events: {
		'click @ui.discard': 'onDiscardClick',
		'click @ui.apply': 'onApplyClick'
	},

	isRevisionApplied: false,

	jqueryXhr: null,

	currentPreviewId: null,

	currentPreviewItem: null,

	initialize: function() {
		this.listenTo( kitbuilder.channels.editor, 'saved', this.onEditorSaved );
	},

	getRevisionViewData: function( revisionView ) {
		var self = this,
			revisionID = revisionView.model.get( 'id' );

		self.jqueryXhr = kitbuilder.ajax.send( 'get_revision_data', {
			data: {
				id: revisionID
			},
			success: function( data ) {
				self.setEditorData( data );

				self.setRevisionsButtonsActive( true );

				self.jqueryXhr = null;

				revisionView.$el.removeClass( 'kitbuilder-revision-item-loading' );

				self.enterReviewMode();
			},
			error: function( data ) {
				revisionView.$el.removeClass( 'kitbuilder-revision-item-loading' );

				if ( 'abort' === self.jqueryXhr.statusText ) {
					return;
				}

				self.currentPreviewItem = null;

				self.currentPreviewId = null;

				alert( 'An error occurred' );
			}
		} );
	},

	setRevisionsButtonsActive: function( active ) {
		this.ui.apply.add( this.ui.discard ).prop( 'disabled', ! active );
	},

	setEditorData: function( data ) {
		var collection = kitbuilder.getRegion( 'sections' ).currentView.collection;

		collection.reset( data );
	},

	deleteRevision: function( revisionView ) {
		var self = this;

		revisionView.$el.addClass( 'kitbuilder-revision-item-loading' );

		kitbuilder.revisions.deleteRevision( revisionView.model, {
			success: function() {
				if ( revisionView.model.get( 'id' ) === self.currentPreviewId ) {
					self.onDiscardClick();
				}

				self.currentPreviewId = null;
			},
			error: function( data ) {
				revisionView.$el.removeClass( 'kitbuilder-revision-item-loading' );

				alert( 'An error occurred' );
			}
		} );
	},

	enterReviewMode: function() {
		kitbuilder.changeEditMode( 'review' );
	},

	exitReviewMode: function() {
		kitbuilder.changeEditMode( 'edit' );
	},

	navigate: function( reverse ) {
		var currentPreviewItemIndex = this.collection.indexOf( this.currentPreviewItem.model ),
			requiredIndex = reverse ? currentPreviewItemIndex - 1 : currentPreviewItemIndex + 1;

		if ( requiredIndex < 0 ) {
			requiredIndex = this.collection.length - 1;
		}

		if ( requiredIndex >= this.collection.length ) {
			requiredIndex = 0;
		}

		this.children.findByIndex( requiredIndex ).ui.detailsArea.trigger( 'click' );
	},

	onEditorSaved: function() {
		this.exitReviewMode();

		this.setRevisionsButtonsActive( false );
	},

	onApplyClick: function() {
		kitbuilder.getPanelView().getChildView( 'footer' )._publishBuilder();

		this.isRevisionApplied = true;

		this.currentPreviewId = null;
	},

	onDiscardClick: function() {
		this.setEditorData( kitbuilder.config.data );

		kitbuilder.setFlagEditorChange( this.isRevisionApplied );

		this.isRevisionApplied = false;

		this.setRevisionsButtonsActive( false );

		this.currentPreviewId = null;

		this.exitReviewMode();

		if ( this.currentPreviewItem ) {
			this.currentPreviewItem.$el.removeClass( 'kitbuilder-revision-current-preview' );
		}
	},

	onDestroy: function() {
		if ( this.currentPreviewId ) {
			this.onDiscardClick();
		}
	},

	onRenderCollection: function() {
		if ( ! this.currentPreviewId ) {
			return;
		}

		var currentPreviewModel = this.collection.findWhere({ id: this.currentPreviewId });

		this.currentPreviewItem = this.children.findByModelCid( currentPreviewModel.cid );

		this.currentPreviewItem.$el.addClass( 'kitbuilder-revision-current-preview' );
	},

	onChildviewDetailsAreaClick: function( childView ) {
		var self = this,
			revisionID = childView.model.get( 'id' );

		if ( revisionID === self.currentPreviewId ) {
			return;
		}

		if ( this.jqueryXhr ) {
			this.jqueryXhr.abort();
		}

		if ( self.currentPreviewItem ) {
			self.currentPreviewItem.$el.removeClass( 'kitbuilder-revision-current-preview' );
		}

		childView.$el.addClass( 'kitbuilder-revision-current-preview kitbuilder-revision-item-loading' );

		if ( kitbuilder.isEditorChanged() && null === self.currentPreviewId ) {
			kitbuilder.saveEditor( {
				status: 'autosave',
				onSuccess: function() {
					self.getRevisionViewData( childView );
				}
			} );
		} else {
			self.getRevisionViewData( childView );
		}

		self.currentPreviewItem = childView;

		self.currentPreviewId = revisionID;
	},

	onChildviewDeleteClick: function( childView ) {
		var self = this,
			type = childView.model.get( 'type' ),
			id = childView.model.get( 'id' );

		var removeDialog = kitbuilder.dialogsManager.createWidget( 'confirm', {
			message: kitbuilder.translate( 'dialog_confirm_delete', [ type ] ),
			headerMessage: kitbuilder.translate( 'delete_element', [ type ] ),
			strings: {
				confirm: kitbuilder.translate( 'delete' ),
				cancel: kitbuilder.translate( 'cancel' )
			},
			defaultOption: 'confirm',
			onConfirm: function() {
				self.deleteRevision( childView );
			}
		} );

		removeDialog.show();
	}
} );

},{"./view":11}],11:[function(require,module,exports){
module.exports =  Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-panel-revisions-revision-item',

	className: 'kitbuilder-revision-item',

	ui: {
		detailsArea: '.kitbuilder-revision-item__details',
		deleteButton: '.kitbuilder-revision-item__tools-delete'
	},

	triggers: {
		'click @ui.detailsArea': 'detailsArea:click',
		'click @ui.deleteButton': 'delete:click'
	}
} );

},{}],12:[function(require,module,exports){
module.exports = Marionette.Behavior.extend( {
	ui: {
		insertButton: '.kitbuilder-template-library-template-insert'
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick'
	},

	onInsertButtonClick: function() {
		var action = this.ui.insertButton.data( 'action' );

		if ( 'insert' === action ) {
			kitbuilder.templates.importTemplate( this.view.model );
		} else {
			open( kitbuilder.config.pro_library_url, '_blank' );
		}
	}
} );

},{}],13:[function(require,module,exports){
var TemplateLibraryTemplateModel = require( 'kitbuilder-templates/models/template' ),
	TemplateLibraryCollection;

TemplateLibraryCollection = Backbone.Collection.extend( {
	model: TemplateLibraryTemplateModel
} );

module.exports = TemplateLibraryCollection;

},{"kitbuilder-templates/models/template":15}],14:[function(require,module,exports){
var TemplateLibraryLayoutView = require( 'kitbuilder-templates/views/layout' ),
	TemplateLibraryCollection = require( 'kitbuilder-templates/collections/templates' ),
	TemplateLibraryManager;

TemplateLibraryManager = function() {
	var self = this,
		modal,
		deleteDialog,
		errorDialog,
		layout,
		templateTypes = {},
		templatesCollection;

	var initLayout = function() {
		layout = new TemplateLibraryLayoutView();
	};

	var registerDefaultTemplateTypes = function() {
		var data = {
			saveDialog: {
				description: kitbuilder.translate( 'save_your_template_description' )
			},
			ajaxParams: {
				success: function( data ) {
					self.getTemplatesCollection().add( data );

					self.setTemplatesSource( 'local' );

					self.showTemplates();
				},
				error: function( data ) {
					self.showErrorDialog( data );
				}
			}
		};

		_.each( [ 'page', 'section' ], function( type ) {
			var safeData = Backbone.$.extend( true, {}, data, {
				saveDialog: {
					title: kitbuilder.translate( 'save_your_template', [ kitbuilder.translate( type ) ] )
				}
			} );

			self.registerTemplateType( type, safeData );
		} );
	};

	this.init = function() {
		registerDefaultTemplateTypes();
	};

	this.getTemplateTypes = function( type ) {
		if ( type ) {
			return templateTypes[ type ];
		}

		return templateTypes;
	};

	this.registerTemplateType = function( type, data ) {
		templateTypes[ type ] = data;
	};

	this.deleteTemplate = function( templateModel ) {
		var dialog = self.getDeleteDialog();

		dialog.onConfirm = function() {
			kitbuilder.ajax.send( 'delete_template', {
				data: {
					source: templateModel.get( 'source' ),
					template_id: templateModel.get( 'template_id' )
				},
				success: function() {
					templatesCollection.remove( templateModel, { silent: true } );

					self.showTemplates();
				}
			} );
		};

		dialog.show();
	};

	this.importTemplate = function( templateModel ) {
		layout.showLoadingView();

		self.requestTemplateContent( templateModel.get( 'source' ), templateModel.get( 'template_id' ), {
			success: function( data ) {
				self.closeModal();

				kitbuilder.getRegion( 'sections' ).currentView.addChildModel( data );
			},
			error: function( data ) {
				self.showErrorDialog( data );
			}
		} );
	};

	this.saveTemplate = function( type, data ) {
		var templateType = templateTypes[ type ];

		_.extend( data, {
			source: 'local',
			type: type
		} );

		if ( templateType.prepareSavedData ) {
			data = templateType.prepareSavedData( data );
		}

		data.data = JSON.stringify( data.data );

		var ajaxParams = { data: data };

		if ( templateType.ajaxParams ) {
			_.extend( ajaxParams, templateType.ajaxParams );
		}

		kitbuilder.ajax.send( 'save_template', ajaxParams );
	};

	this.requestTemplateContent = function( source, id, ajaxOptions ) {
		var options = {
			data: {
				source: source,
				edit_mode: true,
				template_id: id
			}
		};

		if ( ajaxOptions ) {
			_.extend( options, ajaxOptions );
		}

		return kitbuilder.ajax.send( 'get_template_content', options );
	};

	this.getDeleteDialog = function() {
		if ( ! deleteDialog ) {
			deleteDialog = kitbuilder.dialogsManager.createWidget( 'confirm', {
				id: 'kitbuilder-template-library-delete-dialog',
				headerMessage: kitbuilder.translate( 'delete_template' ),
				message: kitbuilder.translate( 'delete_template_confirm' ),
				strings: {
					confirm: kitbuilder.translate( 'delete' )
				}
			} );
		}

		return deleteDialog;
	};

	this.getErrorDialog = function() {
		if ( ! errorDialog ) {
			errorDialog = kitbuilder.dialogsManager.createWidget( 'alert', {
				id: 'kitbuilder-template-library-error-dialog',
				headerMessage: kitbuilder.translate( 'an_error_occurred' )
			} );
		}

		return errorDialog;
	};

	this.getModal = function() {
		if ( ! modal ) {
			modal = kitbuilder.dialogsManager.createWidget( 'lightbox', {
				id: 'kitbuilder-template-library-modal',
				closeButton: false
			} );
		}

		return modal;
	};

	this.getLayout = function() {
		return layout;
	};

	this.getTemplatesCollection = function() {
		return templatesCollection;
	};

	this.requestRemoteTemplates = function( callback, forceUpdate ) {
		if ( templatesCollection && ! forceUpdate ) {
			if ( callback ) {
				callback();
			}

			return;
		}

		kitbuilder.ajax.send( 'get_templates', {
			success: function( data ) {
				templatesCollection = new TemplateLibraryCollection( data );

				if ( callback ) {
					callback();
				}
			}
		} );
	};

	this.startModal = function( onModalReady ) {
		self.getModal().show();

		self.setTemplatesSource( 'local' );

		if ( ! layout ) {
			initLayout();
		}

		layout.showLoadingView();

		self.requestRemoteTemplates( function() {
			if ( onModalReady ) {
				onModalReady();
			}
		} );
	};

	this.closeModal = function() {
		self.getModal().hide();
	};

	this.setTemplatesSource = function( source, trigger ) {
		var channel = kitbuilder.channels.templates;

		channel.reply( 'filter:source', source );

		if ( trigger ) {
			channel.trigger( 'filter:change' );
		}
	};

	this.showTemplates = function() {
		layout.showTemplatesView( templatesCollection );
	};

	this.showTemplatesModal = function() {
		self.startModal( self.showTemplates );
	};

	this.showErrorDialog = function( errorMessage ) {
		if ( 'object' === typeof errorMessage ) {
			var message = '';

			_.each( errorMessage, function( error ) {
				message += '<div>' + error.message + '.</div>';
			} );

			errorMessage = message;
		} else if ( errorMessage ) {
			errorMessage += '.';
		} else {
			errorMessage = '<i>&#60;The error message is empty&#62;</i>';
		}

		self.getErrorDialog()
		    .setMessage( kitbuilder.translate( 'templates_request_error' ) + '<div id="kitbuilder-template-library-error-info">' + errorMessage + '</div>' )
		    .show();
	};
};

module.exports = new TemplateLibraryManager();

},{"kitbuilder-templates/collections/templates":13,"kitbuilder-templates/views/layout":16}],15:[function(require,module,exports){
var TemplateLibraryTemplateModel;

TemplateLibraryTemplateModel = Backbone.Model.extend( {
	defaults: {
		template_id: 0,
		name: '',
		title: '',
		source: '',
		type: '',
		author: '',
		thumbnail: '',
		url: '',
		export_link: '',
		categories: [],
		keywords: []
	}
} );

module.exports = TemplateLibraryTemplateModel;

},{}],16:[function(require,module,exports){
var TemplateLibraryHeaderView = require( 'kitbuilder-templates/views/parts/header' ),
	TemplateLibraryHeaderLogoView = require( 'kitbuilder-templates/views/parts/header-parts/logo' ),
	TemplateLibraryHeaderSaveView = require( 'kitbuilder-templates/views/parts/header-parts/save' ),
	TemplateLibraryHeaderMenuView = require( 'kitbuilder-templates/views/parts/header-parts/menu' ),
	TemplateLibraryHeaderPreviewView = require( 'kitbuilder-templates/views/parts/header-parts/preview' ),
	TemplateLibraryHeaderBackView = require( 'kitbuilder-templates/views/parts/header-parts/back' ),
	TemplateLibraryLoadingView = require( 'kitbuilder-templates/views/parts/loading' ),
	TemplateLibraryCollectionView = require( 'kitbuilder-templates/views/parts/templates' ),
	TemplateLibrarySaveTemplateView = require( 'kitbuilder-templates/views/parts/save-template' ),
	TemplateLibraryImportView = require( 'kitbuilder-templates/views/parts/import' ),
	TemplateLibraryPreviewView = require( 'kitbuilder-templates/views/parts/preview' ),
	TemplateLibraryLayoutView;

TemplateLibraryLayoutView = Marionette.LayoutView.extend( {
	el: '#kitbuilder-template-library-modal',

	regions: {
		modalContent: '.dialog-message',
		modalHeader: '.dialog-widget-header'
	},

	initialize: function() {
		this.getRegion( 'modalHeader' ).show( new TemplateLibraryHeaderView() );
	},

	getHeaderView: function() {
		return this.getRegion( 'modalHeader' ).currentView;
	},

	getTemplateActionButton: function( isPro ) {
		var templateId = '#tmpl-kitbuilder-template-library-' + ( isPro ? 'get-pro-button' : 'insert-button' );

		templateId = kitbuilder.hooks.applyFilters( 'kitbuilder/editor/template-library/template/action-button', templateId );

		var template = Marionette.TemplateCache.get( templateId );

		return Marionette.Renderer.render( template );
	},

	showLoadingView: function() {
		this.modalContent.show( new TemplateLibraryLoadingView() );
	},

	showTemplatesView: function( templatesCollection ) {
		this.modalContent.show( new TemplateLibraryCollectionView( {
			collection: templatesCollection
		} ) );

		var headerView = this.getHeaderView();

		headerView.tools.show( new TemplateLibraryHeaderSaveView() );
		headerView.menuArea.show( new TemplateLibraryHeaderMenuView() );
		headerView.logoArea.show( new TemplateLibraryHeaderLogoView() );
	},

	showImportView: function() {
		this.modalContent.show( new TemplateLibraryImportView() );
	},

	showSaveTemplateView: function( elementModel ) {
		this.modalContent.show( new TemplateLibrarySaveTemplateView( { model: elementModel } ) );

		var headerView = this.getHeaderView();

		headerView.tools.reset();
		headerView.menuArea.reset();
		headerView.logoArea.show( new TemplateLibraryHeaderLogoView() );
	},

	showPreviewView: function( templateModel ) {
		this.modalContent.show( new TemplateLibraryPreviewView( {
			url: templateModel.get( 'url' )
		} ) );

		var headerView = this.getHeaderView();

		headerView.menuArea.reset();

		headerView.tools.show( new TemplateLibraryHeaderPreviewView( {
			model: templateModel
		} ) );

		headerView.logoArea.show( new TemplateLibraryHeaderBackView() );
	}
} );

module.exports = TemplateLibraryLayoutView;

},{"kitbuilder-templates/views/parts/header":22,"kitbuilder-templates/views/parts/header-parts/back":17,"kitbuilder-templates/views/parts/header-parts/logo":18,"kitbuilder-templates/views/parts/header-parts/menu":19,"kitbuilder-templates/views/parts/header-parts/preview":20,"kitbuilder-templates/views/parts/header-parts/save":21,"kitbuilder-templates/views/parts/import":23,"kitbuilder-templates/views/parts/loading":24,"kitbuilder-templates/views/parts/preview":25,"kitbuilder-templates/views/parts/save-template":26,"kitbuilder-templates/views/parts/templates":28}],17:[function(require,module,exports){
var TemplateLibraryHeaderBackView;

TemplateLibraryHeaderBackView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-template-library-header-back',

	id: 'kitbuilder-template-library-header-preview-back',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		kitbuilder.templates.showTemplates();
	}
} );

module.exports = TemplateLibraryHeaderBackView;

},{}],18:[function(require,module,exports){
var TemplateLibraryHeaderLogoView;

TemplateLibraryHeaderLogoView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-template-library-header-logo',

	id: 'kitbuilder-template-library-header-logo',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		kitbuilder.templates.setTemplatesSource( 'local' );
		kitbuilder.templates.showTemplates();
	}
} );

module.exports = TemplateLibraryHeaderLogoView;

},{}],19:[function(require,module,exports){
var TemplateLibraryHeaderMenuView;

TemplateLibraryHeaderMenuView = Marionette.ItemView.extend( {
	options: {
		activeClass: 'kitbuilder-active'
	},

	template: '#tmpl-kitbuilder-template-library-header-menu',

	id: 'kitbuilder-template-library-header-menu',

	ui: {
		menuItems: '.kitbuilder-template-library-menu-item'
	},

	events: {
		'click @ui.menuItems': 'onMenuItemClick'
	},

	$activeItem: null,

	activateMenuItem: function( $item ) {
		var activeClass = this.getOption( 'activeClass' );

		if ( this.$activeItem === $item ) {
			return;
		}

		if ( this.$activeItem ) {
			this.$activeItem.removeClass( activeClass );
		}

		$item.addClass( activeClass );

		this.$activeItem = $item;
	},

	onRender: function() {
		var currentSource = kitbuilder.channels.templates.request( 'filter:source' ),
			$sourceItem = this.ui.menuItems.filter( '[data-template-source="' + currentSource + '"]' );

		this.activateMenuItem( $sourceItem );
	},

	onMenuItemClick: function( event ) {
		var item = event.currentTarget;

		this.activateMenuItem( Backbone.$( item ) );

		kitbuilder.templates.setTemplatesSource( item.dataset.templateSource, true );
	}
} );

module.exports = TemplateLibraryHeaderMenuView;

},{}],20:[function(require,module,exports){
var TemplateLibraryInsertTemplateBehavior = require( 'kitbuilder-templates/behaviors/insert-template' ),
	TemplateLibraryHeaderPreviewView;

TemplateLibraryHeaderPreviewView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-template-library-header-preview',

	id: 'kitbuilder-template-library-header-preview',

	behaviors: {
		insertTemplate: {
			behaviorClass: TemplateLibraryInsertTemplateBehavior
		}
	}
} );

module.exports = TemplateLibraryHeaderPreviewView;

},{"kitbuilder-templates/behaviors/insert-template":12}],21:[function(require,module,exports){
var TemplateLibraryHeaderSaveView;

TemplateLibraryHeaderSaveView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-template-library-header-save',

	id: 'kitbuilder-template-library-header-save',

	className: 'kitbuilder-template-library-header-item',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		kitbuilder.templates.getLayout().showSaveTemplateView();
	}
} );

module.exports = TemplateLibraryHeaderSaveView;

},{}],22:[function(require,module,exports){
var TemplateLibraryHeaderView;

TemplateLibraryHeaderView = Marionette.LayoutView.extend( {

	id: 'kitbuilder-template-library-header',

	template: '#tmpl-kitbuilder-template-library-header',

	regions: {
		logoArea: '#kitbuilder-template-library-header-logo-area',
		tools: '#kitbuilder-template-library-header-tools',
		menuArea: '#kitbuilder-template-library-header-menu-area'
	},

	ui: {
		closeModal: '#kitbuilder-template-library-header-close-modal'
	},

	events: {
		'click @ui.closeModal': 'onCloseModalClick'
	},

	onCloseModalClick: function() {
		kitbuilder.templates.closeModal();
	}
} );

module.exports = TemplateLibraryHeaderView;

},{}],23:[function(require,module,exports){
var TemplateLibraryImportView;

TemplateLibraryImportView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-template-library-import',

	id: 'kitbuilder-template-library-import',

	ui: {
		uploadForm: '#kitbuilder-template-library-import-form'
	},

	events: {
		'submit @ui.uploadForm': 'onFormSubmit'
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		kitbuilder.templates.getLayout().showLoadingView();

		kitbuilder.ajax.send( 'import_template', {
			data: new FormData( this.ui.uploadForm[ 0 ] ),
			processData: false,
			contentType: false,
			success: function( data ) {
				kitbuilder.templates.getTemplatesCollection().add( data.item );

				kitbuilder.templates.showTemplates();
			},
			error: function( data ) {
				kitbuilder.templates.showErrorDialog( data );
			}
		} );
	}
} );

module.exports = TemplateLibraryImportView;

},{}],24:[function(require,module,exports){
var TemplateLibraryLoadingView;

TemplateLibraryLoadingView = Marionette.ItemView.extend( {
	id: 'kitbuilder-template-library-loading',

	template: '#tmpl-kitbuilder-template-library-loading'
} );

module.exports = TemplateLibraryLoadingView;

},{}],25:[function(require,module,exports){
var TemplateLibraryPreviewView;

TemplateLibraryPreviewView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-template-library-preview',

	id: 'kitbuilder-template-library-preview',

	ui: {
		iframe: '> iframe'
	},

	onRender: function() {
		this.ui.iframe.attr( 'src', this.getOption( 'url' ) );
	}
} );

module.exports = TemplateLibraryPreviewView;

},{}],26:[function(require,module,exports){
var TemplateLibrarySaveTemplateView;

TemplateLibrarySaveTemplateView = Marionette.ItemView.extend( {
	id: 'kitbuilder-template-library-save-template',

	template: '#tmpl-kitbuilder-template-library-save-template',

	ui: {
		form: '#kitbuilder-template-library-save-template-form',
		submitButton: '#kitbuilder-template-library-save-template-submit'
	},

	events: {
		'submit @ui.form': 'onFormSubmit'
	},

	getSaveType: function() {
		return this.model ? this.model.get( 'elType' ) : 'page';
	},

	templateHelpers: function() {
		var saveType = this.getSaveType(),
			templateType = kitbuilder.templates.getTemplateTypes( saveType );

		return templateType.saveDialog;
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		var formData = this.ui.form.kitbuilderSerializeObject(),
			saveType = this.model ? this.model.get( 'elType' ) : 'page',
			JSONParams = { removeDefault: true };

		formData.data = this.model ? [ this.model.toJSON( JSONParams ) ] : kitbuilder.elements.toJSON( JSONParams );

		this.ui.submitButton.addClass( 'kitbuilder-button-state' );

		kitbuilder.templates.saveTemplate( saveType, formData );
	}
} );

module.exports = TemplateLibrarySaveTemplateView;

},{}],27:[function(require,module,exports){
var TemplateLibraryTemplatesEmptyView;

TemplateLibraryTemplatesEmptyView = Marionette.ItemView.extend( {
	id: 'kitbuilder-template-library-templates-empty',

	template: '#tmpl-kitbuilder-template-library-templates-empty'
} );

module.exports = TemplateLibraryTemplatesEmptyView;

},{}],28:[function(require,module,exports){
var TemplateLibraryTemplateLocalView = require( 'kitbuilder-templates/views/template/local' ),
	TemplateLibraryTemplateRemoteView = require( 'kitbuilder-templates/views/template/remote' ),
	TemplateLibraryTemplatesEmptyView = require( 'kitbuilder-templates/views/parts/templates-empty' ),
	TemplateLibraryCollectionView;

TemplateLibraryCollectionView = Marionette.CompositeView.extend( {
	template: '#tmpl-kitbuilder-template-library-templates',

	id: 'kitbuilder-template-library-templates',

	childViewContainer: '#kitbuilder-template-library-templates-container',

	emptyView: TemplateLibraryTemplatesEmptyView,

	getChildView: function( childModel ) {
		if ( 'remote' === childModel.get( 'source' ) ) {
			return TemplateLibraryTemplateRemoteView;
		}

		return TemplateLibraryTemplateLocalView;
	},

	initialize: function() {
		this.listenTo( kitbuilder.channels.templates, 'filter:change', this._renderChildren );
	},

	filterByName: function( model ) {
		var filterValue = kitbuilder.channels.templates.request( 'filter:text' );

		if ( ! filterValue ) {
			return true;
		}

		filterValue = filterValue.toLowerCase();

		if ( model.get( 'title' ).toLowerCase().indexOf( filterValue ) >= 0 ) {
			return true;
		}

		return _.any( model.get( 'keywords' ), function( keyword ) {
			return keyword.toLowerCase().indexOf( filterValue ) >= 0;
		} );
	},

	filterBySource: function( model ) {
		var filterValue = kitbuilder.channels.templates.request( 'filter:source' );

		if ( ! filterValue ) {
			return true;
		}

		return filterValue === model.get( 'source' );
	},

	filterByType: function( model ) {
		return false !== kitbuilder.templates.getTemplateTypes( model.get( 'type' ) ).showInLibrary;
	},

	filter: function( childModel ) {
		return this.filterByName( childModel ) && this.filterBySource( childModel ) && this.filterByType( childModel );
	},

	onRenderCollection: function() {
		var isEmpty = this.children.isEmpty();

		this.$childViewContainer.attr( 'data-template-source', isEmpty ? 'empty' : kitbuilder.channels.templates.request( 'filter:source' ) );
	}
} );

module.exports = TemplateLibraryCollectionView;

},{"kitbuilder-templates/views/parts/templates-empty":27,"kitbuilder-templates/views/template/local":30,"kitbuilder-templates/views/template/remote":31}],29:[function(require,module,exports){
var TemplateLibraryInsertTemplateBehavior = require( 'kitbuilder-templates/behaviors/insert-template' ),
	TemplateLibraryTemplateView;

TemplateLibraryTemplateView = Marionette.ItemView.extend( {
	className: function() {
		var classes = 'kitbuilder-template-library-template kitbuilder-template-library-template-' + this.model.get( 'source' );

		if ( this.model.get( 'isPro' ) ) {
			classes += ' kitbuilder-template-library-pro-template';
		}

		return classes;
	},

	ui: function() {
		return {
			previewButton: '.kitbuilder-template-library-template-preview'
		};
	},

	events: function() {
		return {
			'click @ui.previewButton': 'onPreviewButtonClick'
		};
	},

	behaviors: {
		insertTemplate: {
			behaviorClass: TemplateLibraryInsertTemplateBehavior
		}
	}
} );

module.exports = TemplateLibraryTemplateView;

},{"kitbuilder-templates/behaviors/insert-template":12}],30:[function(require,module,exports){
var TemplateLibraryTemplateView = require( 'kitbuilder-templates/views/template/base' ),
	TemplateLibraryTemplateLocalView;

TemplateLibraryTemplateLocalView = TemplateLibraryTemplateView.extend( {
	template: '#tmpl-kitbuilder-template-library-template-local',

	ui: function() {
		return _.extend( TemplateLibraryTemplateView.prototype.ui.apply( this, arguments ), {
			deleteButton: '.kitbuilder-template-library-template-delete'
		} );
	},

	events: function() {
		return _.extend( TemplateLibraryTemplateView.prototype.events.apply( this, arguments ), {
			'click @ui.deleteButton': 'onDeleteButtonClick'
		} );
	},

	onDeleteButtonClick: function() {
		kitbuilder.templates.deleteTemplate( this.model );
	},

	onPreviewButtonClick: function() {
		open( this.model.get( 'url' ), '_blank' );
	}
} );

module.exports = TemplateLibraryTemplateLocalView;

},{"kitbuilder-templates/views/template/base":29}],31:[function(require,module,exports){
var TemplateLibraryTemplateView = require( 'kitbuilder-templates/views/template/base' ),
	TemplateLibraryTemplateRemoteView;

TemplateLibraryTemplateRemoteView = TemplateLibraryTemplateView.extend( {
	template: '#tmpl-kitbuilder-template-library-template-remote',

	onPreviewButtonClick: function() {
		kitbuilder.templates.getLayout().showPreviewView( this.model );
	}
} );

module.exports = TemplateLibraryTemplateRemoteView;

},{"kitbuilder-templates/views/template/base":29}],32:[function(require,module,exports){
/* global KitbuilderConfig */
var App;

Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate, options ) {
	options = {
		evaluate: /<#([\s\S]+?)#>/g,
		interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
		escape: /\{\{([^\}]+?)\}\}(?!\})/g
	};

	return _.template( rawTemplate, options );
};

App = Marionette.Application.extend( {
	helpers: require( 'kitbuilder-editor-utils/helpers' ),
	heartbeat: require( 'kitbuilder-editor-utils/heartbeat' ),
	imagesManager: require( 'kitbuilder-editor-utils/images-manager' ),
	presetsFactory: require( 'kitbuilder-editor-utils/presets-factory' ),
	introduction: require( 'kitbuilder-editor-utils/introduction' ),
	templates: require( 'kitbuilder-templates/manager' ),
	ajax: require( 'kitbuilder-editor-utils/ajax' ),
	conditions: require( 'kitbuilder-editor-utils/conditions' ),
	revisions:  require( 'kitbuilder-revisions/manager' ),
	hotKeys: require( 'kitbuilder-editor-utils/hot-keys' ),

	channels: {
		editor: Backbone.Radio.channel( 'KITBUILDER:editor' ),
		data: Backbone.Radio.channel( 'KITBUILDER:data' ),
		panelElements: Backbone.Radio.channel( 'KITBUILDER:panelElements' ),
		dataEditMode: Backbone.Radio.channel( 'KITBUILDER:editmode' ),
		deviceMode: Backbone.Radio.channel( 'KITBUILDER:deviceMode' ),
		templates: Backbone.Radio.channel( 'KITBUILDER:templates' )
	},

	modules: {
		element: require( 'kitbuilder-models/element' ),
		WidgetView: require( 'kitbuilder-views/widget' ),
		controls: {
			Base: require( 'kitbuilder-views/controls/base' ),
			BaseMultiple: require( 'kitbuilder-views/controls/base-multiple' ),
			Color: require( 'kitbuilder-views/controls/color' ),
			Dimensions: require( 'kitbuilder-views/controls/dimensions' ),
			Image_dimensions: require( 'kitbuilder-views/controls/image-dimensions' ),
			Media: require( 'kitbuilder-views/controls/media' ),
			Slider: require( 'kitbuilder-views/controls/slider' ),
			Wysiwyg: require( 'kitbuilder-views/controls/wysiwyg' ),
			Choose: require( 'kitbuilder-views/controls/choose' ),
			Url: require( 'kitbuilder-views/controls/url' ),
			Font: require( 'kitbuilder-views/controls/font' ),
			Section: require( 'kitbuilder-views/controls/section' ),
			Tab: require( 'kitbuilder-views/controls/tab' ),
			Repeater: require( 'kitbuilder-views/controls/repeater' ),
			Wp_widget: require( 'kitbuilder-views/controls/wp_widget' ),
			Icon: require( 'kitbuilder-views/controls/icon' ),
			Gallery: require( 'kitbuilder-views/controls/gallery' ),
			Select2: require( 'kitbuilder-views/controls/select2' ),
			Date_time: require( 'kitbuilder-views/controls/date-time' ),
			Code: require( 'kitbuilder-views/controls/code' ),
			Box_shadow: require( 'kitbuilder-views/controls/box-shadow' ),
			Structure: require( 'kitbuilder-views/controls/structure' ),
			Animation: require( 'kitbuilder-views/controls/select2' ),
			Hover_animation: require( 'kitbuilder-views/controls/select2' ),
			Order: require( 'kitbuilder-views/controls/order' ),
			Switcher: require( 'kitbuilder-views/controls/switcher' )
		},
		templateLibrary: {
			ElementsCollectionView: require( 'kitbuilder-panel/pages/elements/views/elements' )
		}
	},

	_defaultDeviceMode: 'desktop',

	addControlView: function( controlID, ControlView ) {
		this.modules.controls[ controlID[0].toUpperCase() + controlID.slice( 1 ) ] = ControlView;
	},

	getElementData: function( modelElement ) {
		var elType = modelElement.get( 'elType' );

		if ( 'widget' === elType ) {
			var widgetType = modelElement.get( 'widgetType' );

			if ( ! this.config.widgets[ widgetType ] ) {
				return false;
			}

			return this.config.widgets[ widgetType ];
		}

		if ( ! this.config.elements[ elType ] ) {
			return false;
		}

		return this.config.elements[ elType ];
	},

	getElementControls: function( modelElement ) {
		var self = this,
			elementData = self.getElementData( modelElement );

		if ( ! elementData ) {
			return false;
		}

		var elType = modelElement.get( 'elType' ),
			isInner = modelElement.get( 'isInner' ),
			controls = {};

		_.each( elementData.controls, function( controlData, controlKey ) {
			if ( isInner && controlData.hide_in_inner || ! isInner && controlData.hide_in_top ) {
				return;
			}

			controls[ controlKey ] = _.extend( {}, self.config.controls[ controlData.type ], controlData  );
		} );

		return controls;
	},

	getControlView: function( controlID ) {
		return this.modules.controls[ controlID[0].toUpperCase() + controlID.slice( 1 ) ] || this.modules.controls.Base;
	},

	getPanelView: function() {
		return this.getRegion( 'panel' ).currentView;
	},

	initComponents: function() {
		var EventManager = require( 'kitbuilder-utils/hooks' ),
			PageSettings = require( 'kitbuilder-editor-utils/page-settings' );

		this.hooks = new EventManager();

		this.pageSettings = new PageSettings();

		this.templates.init();

		this.initDialogsManager();

		this.heartbeat.init();
		this.ajax.init();
		this.revisions.init();
		this.hotKeys.init();
	},

	initDialogsManager: function() {
		this.dialogsManager = new DialogsManager.Instance();
	},

	initElements: function() {
		var ElementModel = kitbuilder.modules.element;

		this.elements = new ElementModel.Collection( this.config.data );
	},

	initPreview: function() {
		this.$previewWrapper = Backbone.$( '#kitbuilder-preview' );

		this.$previewResponsiveWrapper = Backbone.$( '#kitbuilder-preview-responsive-wrapper' );

		var previewIframeId = 'kitbuilder-preview-iframe';

		// Make sure the iFrame does not exist.
		if ( ! Backbone.$( '#' + previewIframeId ).length ) {
			var previewIFrame = document.createElement( 'iframe' );

			previewIFrame.id = previewIframeId;
			previewIFrame.src = this.config.preview_link + '&' + ( new Date().getTime() );

			this.$previewResponsiveWrapper.append( previewIFrame );
		}

		this.$preview = Backbone.$( '#' + previewIframeId );

		this.$preview.on( 'load', _.bind( this.onPreviewLoaded, this ) );

		this.initElements();
	},

	initFrontend: function() {
		kitbuilderFrontend.setScopeWindow( this.$preview[0].contentWindow );

		kitbuilderFrontend.init();

		kitbuilderFrontend.elementsHandler.initHandlers();
	},

	initClearPageDialog: function() {
		var self = this,
			dialog;

		self.getClearPageDialog = function() {
			if ( dialog ) {
				return dialog;
			}

			dialog = this.dialogsManager.createWidget( 'confirm', {
				id: 'kitbuilder-clear-page-dialog',
				headerMessage: kitbuilder.translate( 'clear_page' ),
				message: kitbuilder.translate( 'dialog_confirm_clear_page' ),
				position: {
					my: 'center center',
					at: 'center center'
				},
				strings: {
					confirm: kitbuilder.translate( 'delete' ),
					cancel: kitbuilder.translate( 'cancel' )
				},
				onConfirm: function() {
					self.getRegion( 'sections' ).currentView.collection.reset();
				}
			} );

			return dialog;
		};
	},

	onStart: function() {
		this.$window = Backbone.$( window );

		NProgress.start();
		NProgress.inc( 0.2 );

		this.config = KitbuilderConfig;

		Backbone.Radio.DEBUG = false;
		Backbone.Radio.tuneIn( 'KITBUILDER' );

		this.initComponents();

		this.channels.dataEditMode.reply( 'activeMode', 'edit' );

		this.listenTo( this.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.setWorkSaver();

		this.initClearPageDialog();

		this.$window.trigger( 'kitbuilder:init' );

		this.initPreview();

	},

	onPreviewLoaded: function() {
		NProgress.done();

		this.initFrontend();

		this.hotKeys.bindListener( Backbone.$( kitbuilderFrontend.getScopeWindow() ) );

		this.$previewContents = this.$preview.contents();

		var Preview = require( 'kitbuilder-views/preview' ),
			PanelLayoutView = require( 'kitbuilder-layouts/panel/panel' );

		var $previewKitbuilderEl = this.$previewContents.find( '#kitbuilder' );

		if ( ! $previewKitbuilderEl.length ) {
			this.onPreviewElNotFound();
			return;
		}

		var iframeRegion = new Marionette.Region( {
			// Make sure you get the DOM object out of the jQuery object
			el: $previewKitbuilderEl[0]
		} );

		this.$previewContents.on( 'click', function( event ) {
			var $target = Backbone.$( event.target ),
				editMode = kitbuilder.channels.dataEditMode.request( 'activeMode' ),
				isClickInsideKitbuilder = !! $target.closest( '#kitbuilder' ).length,
				isTargetInsideDocument = this.contains( $target[0] );

			if ( isClickInsideKitbuilder && 'edit' === editMode || ! isTargetInsideDocument ) {
				return;
			}

			if ( $target.closest( 'a' ).length ) {
				event.preventDefault();
			}

			/*if ( ! isClickInsideKitbuilder ) {
				var panelView = kitbuilder.getPanelView();

				console.log(panelView.getCurrentPageName());

				if ( 'elements' !== panelView.getCurrentPageName() ) {
					panelView.setPage( 'elements' );
				}
			}*/
		} );

		this.addRegions( {
			sections: iframeRegion,
			panel: '#kitbuilder-panel'
		} );

		this.getRegion( 'sections' ).show( new Preview( {
			collection: this.elements
		} ) );

		this.getRegion( 'panel' ).show( new PanelLayoutView() );

		this.$previewContents
		    .children() // <html>
		    .addClass( 'kitbuilder-html' )
		    .children( 'body' )
		    .addClass( 'kitbuilder-editor-active' );

		// this.setResizablePanel();

		this.changeDeviceMode( this._defaultDeviceMode );

		Backbone.$( '#kitbuilder-loading, #kitbuilder-preview-loading' ).fadeOut( 600 );

		_.defer( function() {
			kitbuilderFrontend.getScopeWindow().jQuery.holdReady( false );
		} );

		this.onEditModeSwitched();

		this.trigger( 'preview:loaded' );
	},

	onEditModeSwitched: function() {
		var activeMode = this.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' === activeMode ) {
			this.exitPreviewMode();
		} else {
			this.enterPreviewMode( 'preview' === activeMode );
		}
	},

	onPreviewElNotFound: function() {
		var dialog = this.dialogsManager.createWidget( 'confirm', {
			id: 'kitbuilder-fatal-error-dialog',
			headerMessage: kitbuilder.translate( 'preview_el_not_found_header' ),
			message: kitbuilder.translate( 'preview_el_not_found_message' ),
			position: {
				my: 'center center',
				at: 'center center'
			},
            strings: {
				confirm: kitbuilder.translate( 'learn_more' ),
				cancel: kitbuilder.translate( 'go_back' )
            },
			onConfirm: function() {
				open( kitbuilder.config.help_the_content_url, '_blank' );
			},
			onCancel: function() {
				parent.history.go( -1 );
			},
			hideOnButtonClick: false
		} );

		dialog.show();
	},

	setFlagEditorChange: function( status ) {
		kitbuilder.channels.editor
			.reply( 'status', status )
			.trigger( 'status:change', status );
	},

	isEditorChanged: function() {
		return ( true === kitbuilder.channels.editor.request( 'status' ) );
	},

	setWorkSaver: function() {
		this.$window.on( 'beforeunload', function() {
			if ( kitbuilder.isEditorChanged() ) {
				return kitbuilder.translate( 'before_unload_alert' );
			}
		} );
	},

	setResizablePanel: function() {
		var self = this,
			side = kitbuilder.config.is_rtl ? 'right' : 'left';

		self.panel.$el.resizable( {
			handles: kitbuilder.config.is_rtl ? 'w' : 'e',
			minWidth: 200,
			maxWidth: 680,
			start: function() {
				self.$previewWrapper
					.addClass( 'ui-resizable-resizing' )
					.css( 'pointer-events', 'none' );
			},
			stop: function() {
				self.$previewWrapper
					.removeClass( 'ui-resizable-resizing' )
					.css( 'pointer-events', '' );

				kitbuilder.channels.data.trigger( 'scrollbar:update' );
			},
			resize: function( event, ui ) {
				self.$previewWrapper
					.css( side, ui.size.width );
			}
		} );
	},

	enterPreviewMode: function( hidePanel ) {
		var $elements = this.$previewContents.find( 'body' );

		if ( hidePanel ) {
			$elements = $elements.add( 'body' );
		}

		$elements
			.removeClass( 'kitbuilder-editor-active' )
			.addClass( 'kitbuilder-editor-preview' );

		if ( hidePanel ) {
			// Handle panel resize
			this.$previewWrapper.css( kitbuilder.config.is_rtl ? 'right' : 'left', '' );

			this.panel.$el.css( 'width', '' );
		}
	},

	exitPreviewMode: function() {
		this.$previewContents
			.find( 'body' )
			.add( 'body' )
			.removeClass( 'kitbuilder-editor-preview' )
			.addClass( 'kitbuilder-editor-active' );
	},

	changeEditMode: function( newMode ) {
		var dataEditMode = kitbuilder.channels.dataEditMode,
			oldEditMode = dataEditMode.request( 'activeMode' );

		dataEditMode.reply( 'activeMode', newMode );

		if ( newMode !== oldEditMode ) {
			dataEditMode.trigger( 'switch', newMode );
		}
	},

	saveEditor: function( options ) {
		options = _.extend( {
			status: 'draft',
			onSuccess: null
		}, options );

		var self = this,
			newData = kitbuilder.elements.toJSON( { removeDefault: true } );

		return this.ajax.send( 'save_builder', {
	        data: {
		        post_id: this.config.post_id,
				status: options.status,
		        data: JSON.stringify( newData )
	        },
			success: function( data ) {
				self.setFlagEditorChange( false );

				self.config.data = newData;

				self.channels.editor.trigger( 'saved', data );

				if ( _.isFunction( options.onSuccess ) ) {
					options.onSuccess.call( this, data );
				}
			}
		} );
	},

	reloadPreview: function() {
		Backbone.$( '#kitbuilder-preview-loading' ).show();

		this.$preview[0].contentWindow.location.reload( true );
	},

	clearPage: function() {
		this.getClearPageDialog().show();
	},

	changeDeviceMode: function( newDeviceMode ) {
		var oldDeviceMode = this.channels.deviceMode.request( 'currentMode' );

		if ( oldDeviceMode === newDeviceMode ) {
			return;
		}

		Backbone.$( 'body' )
			.removeClass( 'kitbuilder-device-' + oldDeviceMode )
			.addClass( 'kitbuilder-device-' + newDeviceMode );

		this.channels.deviceMode
			.reply( 'previousMode', oldDeviceMode )
			.reply( 'currentMode', newDeviceMode )
			.trigger( 'change' );
	},


	translate: function( stringKey, templateArgs, i18nStack ) {
		if ( ! i18nStack ) {
			i18nStack = this.config.i18n;
		}

		var string = i18nStack[ stringKey ];

		if ( undefined === string ) {
			string = stringKey;
		}

		if ( templateArgs ) {
			string = string.replace( /{(\d+)}/g, function( match, number ) {
				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );
		}

		return string;
	},

} );

module.exports = ( window.kitbuilder = new App() ).start();

},{"kitbuilder-editor-utils/ajax":55,"kitbuilder-editor-utils/conditions":56,"kitbuilder-editor-utils/heartbeat":58,"kitbuilder-editor-utils/helpers":59,"kitbuilder-editor-utils/hot-keys":60,"kitbuilder-editor-utils/images-manager":61,"kitbuilder-editor-utils/introduction":62,"kitbuilder-editor-utils/page-settings":65,"kitbuilder-editor-utils/presets-factory":66,"kitbuilder-layouts/panel/panel":49,"kitbuilder-models/element":52,"kitbuilder-panel/pages/elements/views/elements":44,"kitbuilder-revisions/manager":8,"kitbuilder-templates/manager":14,"kitbuilder-utils/hooks":102,"kitbuilder-views/controls/base":74,"kitbuilder-views/controls/base-multiple":72,"kitbuilder-views/controls/box-shadow":75,"kitbuilder-views/controls/choose":76,"kitbuilder-views/controls/code":77,"kitbuilder-views/controls/color":78,"kitbuilder-views/controls/date-time":79,"kitbuilder-views/controls/dimensions":80,"kitbuilder-views/controls/font":81,"kitbuilder-views/controls/gallery":82,"kitbuilder-views/controls/icon":83,"kitbuilder-views/controls/image-dimensions":84,"kitbuilder-views/controls/media":85,"kitbuilder-views/controls/order":86,"kitbuilder-views/controls/repeater":88,"kitbuilder-views/controls/section":89,"kitbuilder-views/controls/select2":90,"kitbuilder-views/controls/slider":91,"kitbuilder-views/controls/structure":92,"kitbuilder-views/controls/switcher":93,"kitbuilder-views/controls/tab":94,"kitbuilder-views/controls/url":95,"kitbuilder-views/controls/wp_widget":96,"kitbuilder-views/controls/wysiwyg":97,"kitbuilder-views/preview":99,"kitbuilder-views/widget":101}],33:[function(require,module,exports){
var EditModeItemView;

EditModeItemView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-mode-switcher-content',

	id: 'kitbuilder-mode-switcher-inner',

	ui: {
		previewButton: '#kitbuilder-mode-switcher-preview-input',
		previewLabel: '#kitbuilder-mode-switcher-preview',
		previewLabelA11y: '#kitbuilder-mode-switcher-preview .kitbuilder-screen-only'
	},

	events: {
		'change @ui.previewButton': 'onPreviewButtonChange'
	},

	initialize: function() {
		this.listenTo( kitbuilder.channels.dataEditMode, 'switch', this.onEditModeChanged );
	},

	getCurrentMode: function() {
		return this.ui.previewButton.is( ':checked' ) ? 'preview' : 'edit';
	},

	setMode: function( mode ) {
		this.ui.previewButton
			.prop( 'checked', 'preview' === mode )
			.trigger( 'change' );
	},

	toggleMode: function() {
		this.setMode( this.ui.previewButton.prop( 'checked' ) ? 'edit' : 'preview' );
	},

	onRender: function() {
		this.onEditModeChanged();
	},

	onPreviewButtonChange: function() {
		kitbuilder.changeEditMode( this.getCurrentMode() );
	},

	onEditModeChanged: function() {
		var activeMode = kitbuilder.channels.dataEditMode.request( 'activeMode' ),
			title = kitbuilder.translate( 'preview' === activeMode ? 'back_to_editor' : 'preview' );

		this.ui.previewLabel.attr( 'title', title );
		this.ui.previewLabelA11y.text( title );
	}
} );

module.exports = EditModeItemView;

},{}],34:[function(require,module,exports){
var PanelFooterItemView;

PanelFooterItemView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-panel-footer-content',

	tagName: 'nav',

	id: 'kitbuilder-panel-footer-tools',

	possibleRotateModes: [ 'portrait', 'landscape' ],

	ui: {
		menuButtons: '.kitbuilder-panel-footer-tool',
		deviceModeIcon: '#kitbuilder-panel-footer-responsive > i',
		deviceModeButtons: '#kitbuilder-panel-footer-responsive .kitbuilder-panel-footer-sub-menu-item',
		buttonSave: '#kitbuilder-panel-footer-save',
		buttonSaveButton: '#kitbuilder-panel-footer-save .kitbuilder-button',
		buttonPublish: '#kitbuilder-panel-footer-publish',
		watchTutorial: '#kitbuilder-panel-footer-watch-tutorial',
		showTemplates: '#kitbuilder-panel-footer-templates-modal',
		saveTemplate: '#kitbuilder-panel-footer-save-template'
	},

	events: {
		'click @ui.deviceModeButtons': 'onClickResponsiveButtons',
		'click @ui.buttonSave': 'onClickButtonSave',
		'click @ui.buttonPublish': 'onClickButtonPublish',
		//'click @ui.watchTutorial': 'onClickWatchTutorial',
		'click @ui.showTemplates': 'onClickShowTemplates',
		'click @ui.saveTemplate': 'onClickSaveTemplate'
	},

	initialize: function() {
		this._initDialog();

		this.listenTo( kitbuilder.channels.editor, 'status:change', this.onEditorChanged )
			.listenTo( kitbuilder.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	_initDialog: function() {
		var dialog;

		this.getDialog = function() {
			if ( ! dialog ) {
				var $ = Backbone.$,
					$dialogMessage = $( '<div>', {
						'class': 'kitbuilder-dialog-message'
					} ),
					$messageIcon = $( '<i>', {
						'class': 'fa fa-check-circle'
					} ),
					$messageText = $( '<div>', {
						'class': 'kitbuilder-dialog-message-text'
					} ).text( kitbuilder.translate( 'saved' ) );

				$dialogMessage.append( $messageIcon, $messageText );

				dialog = kitbuilder.dialogsManager.createWidget( 'popup', {
					hide: {
						delay: 1500
					}
				} );

				dialog.setMessage( $dialogMessage );
			}

			return dialog;
		};
	},

	_publishBuilder: function() {
		var self = this;

		var options = {
			status: 'publish',
			onSuccess: function() {
				self.getDialog().show();

				self.ui.buttonSaveButton.removeClass( 'kitbuilder-button-state' );

				NProgress.done();
			}
		};

		self.ui.buttonSaveButton.addClass( 'kitbuilder-button-state' );

		NProgress.start();

		kitbuilder.saveEditor( options );
	},

	_saveBuilderDraft: function() {
		kitbuilder.saveEditor();
	},

	getDeviceModeButton: function( deviceMode ) {
		return this.ui.deviceModeButtons.filter( '[data-device-mode="' + deviceMode + '"]' );
	},

	onPanelClick: function( event ) {
		var $target = Backbone.$( event.target ),
			isClickInsideOfTool = $target.closest( '.kitbuilder-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			return;
		}

		var $tool = $target.closest( '.kitbuilder-panel-footer-tool' ),
			isClosedTool = $tool.length && ! $tool.hasClass( 'kitbuilder-open' );

		this.ui.menuButtons.removeClass( 'kitbuilder-open' );

		if ( isClosedTool ) {
			$tool.addClass( 'kitbuilder-open' );
		}
	},

	onEditorChanged: function() {
		this.ui.buttonSave.toggleClass( 'kitbuilder-save-active', kitbuilder.isEditorChanged() );
	},

	onDeviceModeChange: function() {
		var previousDeviceMode = kitbuilder.channels.deviceMode.request( 'previousMode' ),
			currentDeviceMode = kitbuilder.channels.deviceMode.request( 'currentMode' );

		this.getDeviceModeButton( previousDeviceMode ).removeClass( 'active' );

		this.getDeviceModeButton( currentDeviceMode ).addClass( 'active' );

		// Change the footer icon
		this.ui.deviceModeIcon.removeClass( 'kb kb-device-' + previousDeviceMode ).addClass( 'kb kb-device-' + currentDeviceMode );
	},

	onClickButtonSave: function() {
		//this._saveBuilderDraft();
		this._publishBuilder();
	},

	onClickButtonPublish: function( event ) {
		// Prevent click on save button
		event.stopPropagation();

		this._publishBuilder();
	},

	onClickResponsiveButtons: function( event ) {
		var $clickedButton = this.$( event.currentTarget ),
			newDeviceMode = $clickedButton.data( 'device-mode' );

		kitbuilder.changeDeviceMode( newDeviceMode );
	},

	onClickWatchTutorial: function() {
		kitbuilder.introduction.startIntroduction();
	},

	onClickShowTemplates: function() {
		kitbuilder.templates.showTemplatesModal();
	},

	onClickSaveTemplate: function() {
		kitbuilder.templates.startModal( function() {
			kitbuilder.templates.getLayout().showSaveTemplateView();
		} );
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			kitbuilder.getPanelView().$el.on( 'click', _.bind( self.onPanelClick, self ) );
		} );
	}
} );

module.exports = PanelFooterItemView;

},{}],35:[function(require,module,exports){
var PanelHeaderItemView;

PanelHeaderItemView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-panel-header',

	id: 'kitbuilder-panel-header',

	ui: {
		menuButton: '#kitbuilder-panel-header-menu-button',
		addButton: '#kitbuilder-panel-header-add-button'
	},

	events: {
		'click @ui.addButton': 'onClickAdd',
		'click @ui.menuButton': 'onClickMenu'
	},

	onClickAdd: function() {
		kitbuilder.getPanelView().setPage( 'elements' );
	},

	onClickMenu: function() {
		var panel = kitbuilder.getPanelView(),
			currentPanelPageName = panel.getCurrentPageName(),
			nextPage = 'menu' === currentPanelPageName ? 'elements' : 'menu';

		panel.setPage( nextPage );
	}
} );

module.exports = PanelHeaderItemView;

},{}],36:[function(require,module,exports){
var ControlsStack = require( 'kitbuilder-views/controls-stack' ),
	EditorView;

EditorView = ControlsStack.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-editor-content' ),

	id: 'kitbuilder-panel-page-editor',

	childViewContainer: '#kitbuilder-controls',

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model.get( 'settings' ),
			elementEditSettings: this.model.get( 'editSettings' )
		};
	},

	activateSection: function( sectionName ) {
		ControlsStack.prototype.activateSection.apply( this, arguments );

		kitbuilder.channels.editor.trigger( 'section:activated', sectionName, this );
	},

	onBeforeRender: function() {
		var controls = kitbuilder.getElementControls( this.model );

		if ( ! controls ) {
			throw new Error( 'Editor controls not found' );
		}

		// Create new instance of that collection
		this.collection = new Backbone.Collection( _.values( controls ) );
	},

	onDestroy: function() {
		var editedElementView = this.getOption( 'editedElementView' );

		if ( editedElementView ) {
			editedElementView.$el.removeClass( 'kitbuilder-element-editable' );
		}

		this.model.trigger( 'editor:close' );

		this.triggerMethod( 'editor:destroy' );
	},

	onRender: function() {
		var editedElementView = this.getOption( 'editedElementView' );

		if ( editedElementView ) {
			editedElementView.$el.addClass( 'kitbuilder-element-editable' );
		}
	},

	onDeviceModeChange: function() {
		ControlsStack.prototype.onDeviceModeChange.apply( this, arguments );

		var self = this;

		// Timeout according to preview resize css animation duration
		setTimeout( function() {
			kitbuilder.$previewContents.find( 'html, body' ).animate( {
				scrollTop: self.getOption( 'editedElementView' ).$el.offset().top - kitbuilder.$preview[0].contentWindow.innerHeight / 2
			} );
		}, 500 );
	},

	onChildviewSettingsChange: function( childView ) {
		var editedElementView = this.getOption( 'editedElementView' ),
			editedElementType = editedElementView.model.get( 'elType' );

		if ( 'widget' === editedElementType ) {
			editedElementType = editedElementView.model.get( 'widgetType' );
		}

		kitbuilder.channels.editor
			.trigger( 'change', childView, editedElementView )
			.trigger( 'change:' + editedElementType, childView, editedElementView )
			.trigger( 'change:' + editedElementType + ':' + childView.model.get( 'name' ), childView, editedElementView );
	}
} );

module.exports = EditorView;

},{"kitbuilder-views/controls-stack":71}],37:[function(require,module,exports){
var PanelElementsCategory = require( '../models/element' ),
	PanelElementsCategoriesCollection;

PanelElementsCategoriesCollection = Backbone.Collection.extend( {
	model: PanelElementsCategory
} );

module.exports = PanelElementsCategoriesCollection;

},{"../models/element":40}],38:[function(require,module,exports){
var PanelElementsElementModel = require( '../models/element' ),
	PanelElementsElementsCollection;

PanelElementsElementsCollection = Backbone.Collection.extend( {
	model: PanelElementsElementModel/*,
	comparator: 'title'*/
} );

module.exports = PanelElementsElementsCollection;

},{"../models/element":40}],39:[function(require,module,exports){
var PanelElementsCategoriesCollection = require( './collections/categories' ),
	PanelElementsElementsCollection = require( './collections/elements' ),
	PanelElementsCategoriesView = require( './views/categories' ),
	PanelElementsElementsView = kitbuilder.modules.templateLibrary.ElementsCollectionView,
	PanelElementsSearchView = require( './views/search' ),
	PanelElementsLayoutView;

PanelElementsLayoutView = Marionette.LayoutView.extend( {
	template: '#tmpl-kitbuilder-panel-elements',

	id: 'kitbuilder-panel-elements-search-area',

	regions: {
		elements: '#kitbuilder-panel-elements-wrapper',
		search: '#kitbuilder-panel-elements-search-area'
	},

	ui: {
		tabs: '.kitbuilder-panel-navigation-tab'
	},

	events: {
		'click @ui.tabs': 'onTabClick'
	},

	regionViews: {},

	elementsCollection: null,

	categoriesCollection: null,

	initialize: function() {
		this.listenTo( kitbuilder.channels.panelElements, 'element:selected', this.destroy );

		this.initElementsCollection();

		this.initCategoriesCollection();

		this.initRegionViews();
	},

	initRegionViews: function() {
		var regionViews = {
			elements: {
				region: this.elements,
				view: PanelElementsElementsView,
				options: { collection: this.elementsCollection }
			},
			categories: {
				region: this.elements,
				view: PanelElementsCategoriesView,
				options: { collection: this.categoriesCollection }
			},
			search: {
				region: this.search,
				view: PanelElementsSearchView
			}
		};

		this.regionViews = kitbuilder.hooks.applyFilters( 'panel/elements/regionViews', regionViews );
	},

	initElementsCollection: function() {
		var elementsCollection = new PanelElementsElementsCollection(),
			sectionConfig = kitbuilder.config.elements.section;

		elementsCollection.add( {
			title: kitbuilder.translate( 'inner_section' ),
			elType: 'section',
			categories: [ 'general-elements' ],
			icon: sectionConfig.icon
		} );

		// TODO: Change the array from server syntax, and no need each loop for initialize
		_.each( kitbuilder.config.widgets, function( element ) {
			elementsCollection.add( {
				title: element.title,
				elType: element.elType,
				categories: element.categories,
				keywords: element.keywords,
				icon: element.icon,
				widgetType: element.widget_type,
				custom: element.custom
			} );
		} );

		this.elementsCollection = elementsCollection;
	},

	initCategoriesCollection: function() {
		var categories = {};

		this.elementsCollection.each( function( element ) {
			_.each( element.get( 'categories' ), function( category ) {
				if ( ! categories[ category ] ) {
					categories[ category ] = [];
				}

				categories[ category ].push( element );
			} );
		} );

		var categoriesCollection = new PanelElementsCategoriesCollection();

		_.each( kitbuilder.config.elements_categories, function( categoryConfig, categoryName ) {
			if ( ! categories[ categoryName ] ) {
				return;
			}

			categoriesCollection.add( {
				name: categoryName,
				title: categoryConfig.title,
				icon: categoryConfig.icon,
				items: categories[ categoryName ]
			} );
		} );

		this.categoriesCollection = categoriesCollection;
	},

	activateTab: function( tabName ) {
		this.ui.tabs
			.removeClass( 'active' )
			.filter( '[data-view="' + tabName + '"]' )
			.addClass( 'active' );

		this.showView( tabName );
	},

	showView: function( viewName ) {
		var viewDetails = this.regionViews[ viewName ],
			options = viewDetails.options || {};

		viewDetails.region.show( new viewDetails.view( options ) );
	},

	clearSearchInput: function() {
		this.getChildView( 'search' ).clearInput();
	},

	changeFilter: function( filterValue ) {
		kitbuilder.channels.panelElements
			.reply( 'filter:value', filterValue )
			.trigger( 'filter:change' );
	},

	clearFilters: function() {
		this.changeFilter( null );
		this.clearSearchInput();
	},

	onChildviewChildrenRender: function() {
		this.updateElementsScrollbar();
	},

	onChildviewSearchChangeInput: function( child ) {
		this.changeFilter( child.ui.input.val(), 'search' );
	},

	onDestroy: function() {
		kitbuilder.channels.panelElements.reply( 'filter:value', null );
	},

	onShow: function() {
		this.showView( 'categories' );

		this.showView( 'search' );
	},

	onTabClick: function( event ) {
		this.activateTab( event.currentTarget.dataset.view );
	},

	updateElementsScrollbar: function() {
		kitbuilder.channels.data.trigger( 'scrollbar:update' );
	}
} );

module.exports = PanelElementsLayoutView;

},{"./collections/categories":37,"./collections/elements":38,"./views/categories":41,"./views/search":45}],40:[function(require,module,exports){
var PanelElementsElementModel;

PanelElementsElementModel = Backbone.Model.extend( {
	defaults: {
		title: '',
		categories: [],
		keywords: [],
		icon: '',
		elType: 'widget',
		widgetType: ''
	}
} );

module.exports = PanelElementsElementModel;

},{}],41:[function(require,module,exports){
var PanelElementsCategoryView = require( './category' ),
	PanelElementsCategoriesView;

PanelElementsCategoriesView = Marionette.CompositeView.extend( {
	template: '#tmpl-kitbuilder-panel-categories',

	childView: PanelElementsCategoryView,

	childViewContainer: '#kitbuilder-panel-categories',

	id: 'kitbuilder-panel-elements-categories',

	initialize: function() {
		this.listenTo( kitbuilder.channels.panelElements, 'filter:change', this.onPanelElementsFilterChange );
	},

	onPanelElementsFilterChange: function() {
		kitbuilder.getPanelView().getCurrentPageView().showView( 'elements' );
	}
} );

module.exports = PanelElementsCategoriesView;

},{"./category":42}],42:[function(require,module,exports){
var PanelElementsElementsCollection = require( '../collections/elements' ),
	PanelElementsCategoryView;

PanelElementsCategoryView = Marionette.CompositeView.extend( {
	template: '#tmpl-kitbuilder-panel-elements-category',

	className: 'kitbuilder-panel-category',

	childView: require( 'kitbuilder-panel/pages/elements/views/element' ),

	childViewContainer: '.panel-elements-category-items',

	initialize: function() {
		this.collection = new PanelElementsElementsCollection( this.model.get( 'items' ) );
	}
} );

module.exports = PanelElementsCategoryView;

},{"../collections/elements":38,"kitbuilder-panel/pages/elements/views/element":43}],43:[function(require,module,exports){
var PanelElementsElementView;

PanelElementsElementView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-element-library-element',

	className: 'kitbuilder-element-wrapper',

	onRender: function() {
		var self = this;

		this.$el.html5Draggable( {

			onDragStart: function() {
				kitbuilder.channels.panelElements
					.reply( 'element:selected', self )
					.trigger( 'element:drag:start' );
			},

			onDragEnd: function() {
				kitbuilder.channels.panelElements.trigger( 'element:drag:end' );
			},

			groups: [ 'kitbuilder-element' ]
		} );
	}
} );

module.exports = PanelElementsElementView;

},{}],44:[function(require,module,exports){
var PanelElementsElementsView;

PanelElementsElementsView = Marionette.CollectionView.extend( {
	childView: require( 'kitbuilder-panel/pages/elements/views/element' ),

	id: 'kitbuilder-panel-elements',

	initialize: function() {
		this.listenTo( kitbuilder.channels.panelElements, 'filter:change', this.onFilterChanged );
	},

	filter: function( childModel ) {
		var filterValue = kitbuilder.channels.panelElements.request( 'filter:value' );

		if ( ! filterValue ) {
			return true;
		}

		if ( -1 !== childModel.get( 'title' ).toLowerCase().indexOf( filterValue.toLowerCase() ) ) {
			return true;
		}

		return _.any( childModel.get( 'keywords' ), function( keyword ) {
			return ( -1 !== keyword.toLowerCase().indexOf( filterValue.toLowerCase() ) );
		} );
	},

	onFilterChanged: function() {
		var filterValue = kitbuilder.channels.panelElements.request( 'filter:value' );

		if ( ! filterValue ) {
			this.onFilterEmpty();
		}

		this._renderChildren();

		this.triggerMethod( 'children:render' );
	},

	onFilterEmpty: function() {
		kitbuilder.getPanelView().getCurrentPageView().showView( 'categories' );
	}
} );

module.exports = PanelElementsElementsView;

},{"kitbuilder-panel/pages/elements/views/element":43}],45:[function(require,module,exports){
var PanelElementsSearchView;

PanelElementsSearchView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-panel-element-search',

	id: 'kitbuilder-panel-elements-search-wrapper',

	ui: {
		input: 'input'
	},

	events: {
		'keyup @ui.input': 'onInputChanged'
	},

	onInputChanged: function( event ) {
		var ESC_KEY = 27;

		if ( ESC_KEY === event.keyCode ) {
			this.clearInput();
		}

		this.triggerMethod( 'search:change:input' );
	},

	clearInput: function() {
		this.ui.input.val( '' );
	}
} );

module.exports = PanelElementsSearchView;

},{}],46:[function(require,module,exports){
var PanelMenuItemView = require( 'kitbuilder-panel/pages/menu/views/item' ),
	PanelMenuPageView;

PanelMenuPageView = Marionette.CollectionView.extend( {
	id: 'kitbuilder-panel-page-menu',

	childView: PanelMenuItemView,

	initialize: function() {
		this.collection = new Backbone.Collection( [
			{
				icon: 'fa fa-history',
				title: kitbuilder.translate( 'revision_history' ),
				type: 'page',
				pageName: 'revisionsPage'
			},
			{
				icon: 'fa fa-cog',
				title: kitbuilder.translate( 'page_settings' ),
				type: 'page',
				pageName: 'settingsPage'
			},
            {
                icon: 'fa fa-eraser',
                title: kitbuilder.translate( 'clear_page' ),
                callback: function() {
                    kitbuilder.clearPage();
                }
            },
			{
				icon: 'kb kb-kitbuilder',
				title: kitbuilder.translate( 'kitbuilder_settings' ),
				type: 'link',
				link: kitbuilder.config.settings_page_link,
				newTab: true
			}
		] );
	},

	onChildviewClick: function( childView ) {
		var menuItemType = childView.model.get( 'type' );

		switch ( menuItemType ) {
			case 'page' :
				var pageName = childView.model.get( 'pageName' ),
					pageTitle = childView.model.get( 'title' );

				kitbuilder.getPanelView().setPage( pageName, pageTitle );
				break;

			case 'link' :
				var link = childView.model.get( 'link' ),
					isNewTab = childView.model.get( 'newTab' );

				if ( isNewTab ) {
					open( link, '_blank' );
				} else {
					location.href = childView.model.get( 'link' );
				}

				break;

			default:
				var callback = childView.model.get( 'callback' );

				if ( _.isFunction( callback ) ) {
					callback.call( childView );
				}
		}
	}
} );

module.exports = PanelMenuPageView;

},{"kitbuilder-panel/pages/menu/views/item":47}],47:[function(require,module,exports){
var PanelMenuItemView;

PanelMenuItemView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-panel-menu-item',

	className: 'kitbuilder-panel-menu-item',

	triggers: {
		click: 'click'
	}
} );

module.exports = PanelMenuItemView;

},{}],48:[function(require,module,exports){
var ControlsStack = require( 'kitbuilder-views/controls-stack' );

module.exports = ControlsStack.extend( {
	id: 'kitbuilder-panel-page-settings',

	template: '#tmpl-kitbuilder-panel-page-settings',

	childViewContainer: '#kitbuilder-panel-page-settings-controls',

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	initialize: function() {
		this.model = kitbuilder.pageSettings.model;

		this.collection = new Backbone.Collection( _.values( this.model.controls ) );
	}
} );

},{"kitbuilder-views/controls-stack":71}],49:[function(require,module,exports){
var EditModeItemView = require( 'kitbuilder-layouts/edit-mode' ),
	PanelLayoutView;

PanelLayoutView = Marionette.LayoutView.extend( {
	template: '#tmpl-kitbuilder-panel',

	id: 'kitbuilder-panel-inner',

	regions: {
		content: '#kitbuilder-panel-content-wrapper',
		header: '#kitbuilder-panel-header-wrapper',
		footer: '#kitbuilder-panel-footer',
		modeSwitcher: '#kitbuilder-mode-switcher'
	},

	ui:{
		modalTitle: '#kitbuilder-panel-elements-header',
		panelContainer: '#kitbuilder-panel-content-wrap',
        panelColse: '#kitbuilder-panel-elements-header-close',
        resizeable: '#kitbuilder-panel-content-wrapper-top'
	},

	pages: {},

	childEvents: {
		'click:add': function() {
			this.setPage( 'elements' );
		},
		'editor:destroy': function() {
			this.setPage( 'elements' );
		}
	},

	currentPageName: null,

	_isScrollbarInitialized: false,
    _isDragablePanel: false,
    _isResizablePanel: false,

	initialize: function() {
		this.initPages();
	},

	buildPages: function() {
		var pages = {
			elements: {
				view: require( 'kitbuilder-panel/pages/elements/elements' ),
                title: kitbuilder.translate( 'element' )
			},
			editor: {
				view: require( 'kitbuilder-panel/pages/editor' )
			},
			menu: {
				view: require( 'kitbuilder-panel/pages/menu/menu' ),
				title: kitbuilder.translate( 'global_settings' )
			},
			settingsPage: {
				view: require( 'kitbuilder-panel/pages/page-settings/page-settings' ),
				title: kitbuilder.translate( 'page_settings' )
			}
		};


		return pages;
	},

	initPages: function() {
		var pages;

		this.getPages = function( page ) {
			if ( ! pages ) {
				pages = this.buildPages();
			}

			return page ? pages[ page ] : pages;
		};

		this.addPage = function( pageName, pageData ) {
			if ( ! pages ) {
				pages = this.buildPages();
			}

			pages[ pageName ] = pageData;
		};
	},

	getHeaderView: function() {
		return this.getChildView( 'header' );
	},

	getFooterView: function() {
		return this.getChildView( 'footer' );
	},

	getCurrentPageName: function() {
		return this.currentPageName;
	},

	getCurrentPageView: function() {
		return this.getChildView( 'content' );
	},

	setPage: function( page, title, viewOptions ) {
		var pageData = this.getPages( page );

		if ( ! pageData ) {
			throw new ReferenceError( 'Kitbuilder panel doesn\'t have page named \'' + page + '\'' );
		}

		if ( pageData.options ) {
			viewOptions = _.extend( pageData.options, viewOptions );
		}

		var View = pageData.view;

		if ( pageData.getView ) {
			View = pageData.getView();
		}

		var newContentView = new View( viewOptions );


		this.showChildView( 'content',  newContentView);

        this.ui.modalTitle.html( title || pageData.title );

		this.currentPageName = page;

        this.showContentPanel();
	},

	openEditor: function( model, view ) {
		var currentPageName = this.getCurrentPageName();

		if ( 'editor' === currentPageName ) {
			var currentPageView = this.getCurrentPageView(),
				currentEditableModel = currentPageView.model;

			if ( currentEditableModel === model ) {
				return;
			}
		}

		var elementData = kitbuilder.getElementData( model );

		this.setPage( 'editor', kitbuilder.translate( 'edit_element', [ elementData.title ] ), {
			model: model,
			editedElementView: view
		} );

		var action = 'panel/open_editor/' + model.get( 'elType' );

		// Example: panel/open_editor/widget
		kitbuilder.hooks.doAction( action, this, model, view );

		// Example: panel/open_editor/widget/heading
		kitbuilder.hooks.doAction( action + '/' + model.get( 'widgetType' ), this, model, view );
	},

	onBeforeShow: function() {
		var PanelFooterItemView = require( 'kitbuilder-layouts/panel/footer' ),
			PanelHeaderItemView = require( 'kitbuilder-layouts/panel/header' );

		// Edit Mode
		this.showChildView( 'modeSwitcher', new EditModeItemView() );

		// Header
		this.showChildView( 'header', new PanelHeaderItemView() );

		// Footer
		this.showChildView( 'footer', new PanelFooterItemView() );

		// Added Editor events
		this.updateScrollbar = _.throttle( this.updateScrollbar, 100 );

		this.getRegion( 'content' )
			.on( 'before:show', _.bind( this.onEditorBeforeShow, this ) )
			.on( 'empty', _.bind( this.onEditorEmpty, this ) )
			.on( 'show', _.bind( this.updateScrollbar, this ) );

        this.getRegion( 'content' ).on( 'show', _.bind( this.dragablePanel, this ) );
        this.getRegion( 'content' ).on( 'show empty', _.bind( this.resizablePanel, this ) );

        this.ui.panelColse.on('click', _.bind( this.hideContentPanel, this ));

		// Set default page to elements
		// this.setPage( 'elements' );

		this.listenTo( kitbuilder.channels.data, 'scrollbar:update', this.updateScrollbar );

	},

	onEditorBeforeShow: function() {
		_.defer( _.bind( this.updateScrollbar, this ) );
	},

	onEditorEmpty: function() {
		this.updateScrollbar();
	},

    showContentPanel: function () {
        this.ui.panelContainer.addClass('active');
    },

    hideContentPanel: function () {
        this.setPage( 'elements' );
        this.ui.panelContainer.removeClass('active');
        this.currentPageName = null;
    },

	dragablePanel: function () {
        var $dpanel = this.ui.panelContainer;

        if ( ! this._isDragablePanel ) {
            $dpanel.draggable({handle: "#kitbuilder-panel-elements-header"});
            this._isDragablePanel = true;

            return;
        }
    },

    resizablePanel: function () {
        var $panel = this.ui.resizeable;

        if ( ! this._isResizablePanel ) {
            $panel.resizable({
                delay: 0,
                minWidth: 200,
                start: function( e, ui ) {
                    e.preventDefault();
                },
                resize: function (e, ui) {
                    e.preventDefault();
                    $panel.css({height: ui.size.height, width: ui.size.width});

                },
				stop: function () {
                    kitbuilder.channels.data.trigger( 'scrollbar:update' );
                }
			});
            this._isResizablePanel = true;

        } else {
            $panel.resizable("destroy");
            $panel.resizable({
                delay: 0,
                minWidth: 200,
                resize: function (e, ui) {
                    $panel.css({height: ui.size.height, width: ui.size.width});
                },
                stop: function () {
                    kitbuilder.channels.data.trigger( 'scrollbar:update' );
                }
            });
        }
    },

	updateScrollbar: function() {
		var $panel = this.content.$el;

		if ( ! this._isScrollbarInitialized ) {
			$panel.perfectScrollbar();
			this._isScrollbarInitialized = true;

			return;
		}

		$panel.perfectScrollbar( 'update' );
	}
} );

module.exports = PanelLayoutView;

},{"kitbuilder-layouts/edit-mode":33,"kitbuilder-layouts/panel/footer":34,"kitbuilder-layouts/panel/header":35,"kitbuilder-panel/pages/editor":36,"kitbuilder-panel/pages/elements/elements":39,"kitbuilder-panel/pages/menu/menu":46,"kitbuilder-panel/pages/page-settings/page-settings":48}],50:[function(require,module,exports){
var BaseSettingsModel;

BaseSettingsModel = Backbone.Model.extend( {
	options: {},

	initialize: function( data, options ) {
		var self = this;

		if ( options ) {
			// Keep the options for cloning
			self.options = options;
		}

		self.controls = ( options && options.controls ) ? options.controls : kitbuilder.getElementControls( self );

		if ( ! self.controls ) {
			return;
		}

		var attrs = data || {},
			defaults = {};

		_.each( self.controls, function( field ) {
			var control = kitbuilder.config.controls[ field.type ],
				isMultipleControl = _.isObject( control.default_value );

			if ( isMultipleControl  ) {
				defaults[ field.name ] = _.extend( {}, control.default_value, field['default'] || {} );
			} else {
				defaults[ field.name ] = field['default'] || control.default_value;
			}

			if ( undefined !== attrs[ field.name ] ) {
				if ( isMultipleControl && ! _.isObject( attrs[ field.name ] ) ) {

					console.error('An invalid argument supplied as multiple control value: Element `' + ( self.get( 'widgetType' ) || self.get( 'elType' ) ) + '` got <' + attrs[ field.name ] + '> as `' + field.name + '` value. Expected array or object.');

					delete attrs[ field.name ];
				}
			}

			if ( undefined === attrs[ field.name ] ) {
				attrs[ field.name ] = defaults[ field.name ];
			}
		} );

		self.defaults = defaults;

		self.handleRepeaterData( attrs );

		self.set( attrs );
	},

	handleRepeaterData: function( attrs ) {
		_.each( this.controls, function( field ) {
			if ( field.is_repeater ) {
				// TODO: Apply defaults on each field in repeater fields
				if ( ! ( attrs[ field.name ] instanceof Backbone.Collection ) ) {
					attrs[ field.name ] = new Backbone.Collection( attrs[ field.name ], {
						model: function( attrs, options ) {
							options = options || {};

							options.controls = field.fields;

							if ( ! attrs._id ) {
								attrs._id = kitbuilder.helpers.getUniqueID();
							}

							return new BaseSettingsModel( attrs, options );
						}
					} );
				}
			}
		} );
	},

	getFontControls: function() {
		return _.filter( this.getActiveControls(), function( control ) {
			return 'font' === control.type;
		} );
	},

	getStyleControls: function( controls ) {
		var self = this;

		controls = controls || self.getActiveControls();

		return _.filter( controls, function( control ) {
			if ( control.fields ) {
				control.styleFields = self.getStyleControls( control.fields );

				return true;
			}

			return self.isStyleControl( control.name, controls );
		} );
	},

	isStyleControl: function( attribute, controls ) {
		controls = controls || this.controls;

		var currentControl = _.find( controls, function( control ) {
			return attribute === control.name;
		} );

		return currentControl && ! _.isEmpty( currentControl.selectors );
	},

	getClassControls: function( controls ) {
		controls = controls || this.controls;

		return _.filter( controls, function( control ) {
			return ! _.isUndefined( control.prefix_class );
		} );
	},

	isClassControl: function( attribute ) {
		var currentControl = _.find( this.controls, function( control ) {
			return attribute === control.name;
		} );

		return currentControl && ! _.isUndefined( currentControl.prefix_class );
	},

	getControl: function( id ) {
		return _.find( this.controls, function( control ) {
			return id === control.name;
		} );
	},

	getActiveControls: function() {
		var self = this,
			controls = {};

		_.each( self.controls, function( control, controlKey ) {
			if ( kitbuilder.helpers.isActiveControl( control, self.attributes ) ) {
				controls[ controlKey ] = control;
			}
		} );

		return controls;
	},

	clone: function() {
		return new BaseSettingsModel( kitbuilder.helpers.cloneObject( this.attributes ), kitbuilder.helpers.cloneObject( this.options ) );
	},

	toJSON: function( options ) {
		var data = Backbone.Model.prototype.toJSON.call( this );

		options = options || {};

		delete data.widgetType;
		delete data.elType;
		delete data.isInner;

		_.each( data, function( attribute, key ) {
			if ( attribute && attribute.toJSON ) {
				data[ key ] = attribute.toJSON();
			}
		} );

		if ( options.removeDefault ) {
			var controls = this.controls;

			_.each( data, function( value, key ) {
				var control = controls[ key ];

				if ( control ) {
					if ( ( 'text' === control.type || 'textarea' === control.type ) && data[ key ] ) {
						return;
					}

					if ( 'object' === typeof data[ key ] ) {
						// First check length difference
						if ( Object.keys( data[ key ] ).length !== Object.keys( control[ 'default' ] ).length ) {
							return;
						}

						// If it's equal length, loop over value
						var isEqual = true;

						_.each( data[ key ], function( propertyValue, propertyKey ) {
							if ( data[ key ][ propertyKey ] !== control[ 'default' ][ propertyKey ] ) {
								return isEqual = false;
							}
						} );

						if ( isEqual ) {
							delete data[ key ];
						}
					} else {
						if ( data[ key ] === control[ 'default' ] ) {
							delete data[ key ];
						}
					}
				}
			} );
		}

		return data;
	}
} );

module.exports = BaseSettingsModel;

},{}],51:[function(require,module,exports){
var BaseSettingsModel = require( 'kitbuilder-models/base-settings' ),
	ColumnSettingsModel;

ColumnSettingsModel = BaseSettingsModel.extend( {
	defaults: {
		_inline_size: '',
		_column_size: 100
	}
} );

module.exports = ColumnSettingsModel;

},{"kitbuilder-models/base-settings":50}],52:[function(require,module,exports){
var BaseSettingsModel = require( 'kitbuilder-models/base-settings' ),
	WidgetSettingsModel = require( 'kitbuilder-models/widget-settings' ),
	ColumnSettingsModel = require( 'kitbuilder-models/column-settings' ),
	SectionSettingsModel = require( 'kitbuilder-models/section-settings' ),

	ElementModel,
	ElementCollection;

ElementModel = Backbone.Model.extend( {
	defaults: {
		id: '',
		elType: '',
		isInner: false,
		settings: {},
		defaultEditSettings: {}
	},

	remoteRender: false,
	_htmlCache: null,
	_jqueryXhr: null,
	renderOnLeave: false,

	initialize: function( options ) {
		var elType = this.get( 'elType' ),
			elements = this.get( 'elements' );

		if ( undefined !== elements ) {
			this.set( 'elements', new ElementCollection( elements ) );
		}

		if ( 'widget' === elType ) {
			this.remoteRender = true;
			this.setHtmlCache( options.htmlCache || '' );
		}

		// No need this variable anymore
		delete options.htmlCache;

		// Make call to remote server as throttle function
		this.renderRemoteServer = _.throttle( this.renderRemoteServer, 1000 );

		this.initSettings();

		this.initEditSettings();

		this.on( {
			destroy: this.onDestroy,
			'editor:close': this.onCloseEditor
		} );
	},

	initSettings: function() {
		var elType = this.get( 'elType' ),
			settings = this.get( 'settings' ),
			settingModels = {
				widget: WidgetSettingsModel,
				column: ColumnSettingsModel,
				section: SectionSettingsModel
			},
			SettingsModel = settingModels[ elType ] || BaseSettingsModel;

		if ( Backbone.$.isEmptyObject( settings ) ) {
			settings = kitbuilder.helpers.cloneObject( settings );
		}

		if ( 'widget' === elType ) {
			settings.widgetType = this.get( 'widgetType' );
		}

		settings.elType = elType;
		settings.isInner = this.get( 'isInner' );

		settings = new SettingsModel( settings );

		this.set( 'settings', settings );

		kitbuilderFrontend.config.elements.data[ this.cid ] = settings;
	},

	initEditSettings: function() {
		this.set( 'editSettings', new Backbone.Model( this.get( 'defaultEditSettings' ) ) );
	},

	onDestroy: function() {
		// Clean the memory for all use instances
		var settings = this.get( 'settings' ),
			elements = this.get( 'elements' );

		if ( undefined !== elements ) {
			_.each( _.clone( elements.models ), function( model ) {
				model.destroy();
			} );
		}

		if ( settings instanceof BaseSettingsModel ) {
			settings.destroy();
		}
	},

	onCloseEditor: function() {
		this.initEditSettings();

		if ( this.renderOnLeave ) {
			this.renderRemoteServer();
		}
	},

	setSetting: function( key, value, triggerChange ) {
		triggerChange = triggerChange || false;

		var settings = this.get( 'settings' );

		settings.set( key, value );

		this.set( 'settings', settings );

		if ( triggerChange ) {
			this.trigger( 'change', this );
			this.trigger( 'change:settings', this );
			this.trigger( 'change:settings:' + key, this );
		}
	},

	getSetting: function( key ) {
		var settings = this.get( 'settings' );

		if ( undefined === settings.get( key ) ) {
			return '';
		}

		return settings.get( key );
	},

	setHtmlCache: function( htmlCache ) {
		this._htmlCache = htmlCache;
	},

	getHtmlCache: function() {
		return this._htmlCache;
	},

	getTitle: function() {
		var elementData = kitbuilder.getElementData( this );

		return ( elementData ) ? elementData.title : 'Unknown';
	},

	getIcon: function() {
		var elementData = kitbuilder.getElementData( this );

		return ( elementData ) ? elementData.icon : 'unknown';
	},

	createRemoteRenderRequest: function() {
		var data = this.toJSON();

		return kitbuilder.ajax.send( 'render_widget', {
			data: {
				post_id: kitbuilder.config.post_id,
				data: JSON.stringify( data ),
				_nonce: kitbuilder.config.nonce
			},
			success: _.bind( this.onRemoteGetHtml, this )
		} );
	},

	renderRemoteServer: function() {
		if ( ! this.remoteRender ) {
			return;
		}

		this.renderOnLeave = false;

		this.trigger( 'before:remote:render' );

		if ( this.isRemoteRequestActive() ) {
			this._jqueryXhr.abort();
		}

		this._jqueryXhr = this.createRemoteRenderRequest();
	},

	isRemoteRequestActive: function() {
		return this._jqueryXhr && 4 !== this._jqueryXhr.readyState;
	},

	onRemoteGetHtml: function( data ) {
		this.setHtmlCache( data.render );
		this.trigger( 'remote:render' );
	},

	clone: function() {
		var newModel = new this.constructor( kitbuilder.helpers.cloneObject( this.attributes ) );

		newModel.set( 'id', kitbuilder.helpers.getUniqueID() );

		newModel.setHtmlCache( this.getHtmlCache() );

		var elements = this.get( 'elements' );

		if ( ! _.isEmpty( elements ) ) {
			newModel.set( 'elements', elements.clone() );
		}

		return newModel;
	},

	toJSON: function( options ) {
		options = _.extend( { copyHtmlCache: false }, options );

		// Call parent's toJSON method
		var data = Backbone.Model.prototype.toJSON.call( this );

		_.each( data, function( attribute, key ) {
			if ( attribute && attribute.toJSON ) {
				data[ key ] = attribute.toJSON( options );
			}
		} );

		if ( options.copyHtmlCache ) {
			data.htmlCache = this.getHtmlCache();
		} else {
			delete data.htmlCache;
		}

		return data;
	}

} );

ElementCollection = Backbone.Collection.extend( {
	add: function( models, options, isCorrectSet ) {
		if ( ( ! options || ! options.silent ) && ! isCorrectSet ) {
			throw 'Call Error: Adding model to element collection is allowed only by the dedicated addChildModel() method.';
		}

		return Backbone.Collection.prototype.add.call( this, models, options );
	},

	model: function( attrs, options ) {
		var ModelClass = Backbone.Model;

		if ( attrs.elType ) {
			ModelClass = kitbuilder.hooks.applyFilters( 'element/model', ElementModel, attrs );
		}

		return new ModelClass( attrs, options );
	},

	clone: function() {
		var tempCollection = Backbone.Collection.prototype.clone.apply( this, arguments ),
			newCollection = new ElementCollection();

		tempCollection.forEach( function( model ) {
			newCollection.add( model.clone(), null, true );
		} );

		return newCollection;
	}
} );

ElementCollection.prototype.sync = function() {
	return null;
};

ElementCollection.prototype.fetch = function() {
	return null;
};

ElementCollection.prototype.save = function() {
	return null;
};

ElementModel.prototype.sync = function() {
	return null;
};
ElementModel.prototype.fetch = function() {
	return null;
};
ElementModel.prototype.save = function() {
	return null;
};

module.exports = {
	Model: ElementModel,
	Collection: ElementCollection
};

},{"kitbuilder-models/base-settings":50,"kitbuilder-models/column-settings":51,"kitbuilder-models/section-settings":53,"kitbuilder-models/widget-settings":54}],53:[function(require,module,exports){
var BaseSettingsModel = require( 'kitbuilder-models/base-settings' ),
	SectionSettingsModel;

SectionSettingsModel = BaseSettingsModel.extend( {
	defaults: {}
} );

module.exports = SectionSettingsModel;

},{"kitbuilder-models/base-settings":50}],54:[function(require,module,exports){
var BaseSettingsModel = require( 'kitbuilder-models/base-settings' ),
	WidgetSettingsModel;

WidgetSettingsModel = BaseSettingsModel.extend( {

} );

module.exports = WidgetSettingsModel;

},{"kitbuilder-models/base-settings":50}],55:[function(require,module,exports){
var Ajax;

Ajax = {
	config: {},

	initConfig: function() {
		this.config = {
			ajaxParams: {
				type: 'POST',
				url: kitbuilder.config.ajaxurl,
				data: {}
			},
			actionPrefix: 'kitbuilder_'
		};
	},

	init: function() {
		this.initConfig();
	},

	send: function( action, options ) {
		var ajaxParams = kitbuilder.helpers.cloneObject( this.config.ajaxParams );

		options = options || {};

		action = this.config.actionPrefix + action;

		Backbone.$.extend( ajaxParams, options );

		if ( ajaxParams.data instanceof FormData ) {
			ajaxParams.data.append( 'action', action );
			ajaxParams.data.append( '_nonce', kitbuilder.config.nonce );
		} else {
			ajaxParams.data.action = action;
			ajaxParams.data._nonce = kitbuilder.config.nonce;
		}

		var successCallback = ajaxParams.success,
			errorCallback = ajaxParams.error;

		if ( successCallback || errorCallback ) {
			ajaxParams.success = function( response ) {
				if ( response.success && successCallback ) {
					successCallback( response.data );
				}

				if ( ( ! response.success ) && errorCallback ) {
					errorCallback( response.data );
				}
			};

			if ( errorCallback ) {
				ajaxParams.error = function( data ) {
					errorCallback( data );
				};
			}
		}

		return Backbone.$.ajax( ajaxParams );
	}
};

module.exports = Ajax;

},{}],56:[function(require,module,exports){
var Conditions;

Conditions = function() {
	var self = this;

	this.compare = function( leftValue, rightValue, operator ) {
		switch ( operator ) {
			/* jshint ignore:start */
			case '==':
				return leftValue == rightValue;
			case '!=':
				return leftValue != rightValue;
			/* jshint ignore:end */
			case '!==':
				return leftValue !== rightValue;
			case 'in':
				return -1 !== rightValue.indexOf( leftValue );
			case '!in':
				return -1 === rightValue.indexOf( leftValue );
			case '<':
				return leftValue < rightValue;
			case '<=':
				return leftValue <= rightValue;
			case '>':
				return leftValue > rightValue;
			case '>=':
				return leftValue >= rightValue;
			default:
				return leftValue === rightValue;
		}
	};

	this.check = function( conditions, comparisonObject ) {
		var isOrCondition = 'or' === conditions.relation,
			conditionSucceed = ! isOrCondition;

		Backbone.$.each( conditions.terms, function() {
			var term = this,
				comparisonResult;

			if ( term.terms ) {
				comparisonResult = self.check( term, comparisonObject );
			} else {
				var parsedName = term.name.match( /(\w+)(?:\[(\w+)])?/ ),
					value = comparisonObject[ parsedName[ 1 ] ];

				if ( parsedName[ 2 ] ) {
					value = value[ parsedName[ 2 ] ];
				}

				comparisonResult = self.compare( value, term.value, term.operator );
			}

			if ( isOrCondition ) {
				if ( comparisonResult ) {
					conditionSucceed = true;
				}

				return ! comparisonResult;
			}

			if ( ! comparisonResult ) {
				return conditionSucceed = false;
			}
		} );

		return conditionSucceed;
	};
};

module.exports = new Conditions();

},{}],57:[function(require,module,exports){
var ViewModule = require( 'kitbuilder-utils/view-module' ),
	Stylesheet = require( 'kitbuilder-editor-utils/stylesheet' ),
	ControlsCSSParser;

ControlsCSSParser = ViewModule.extend( {
	stylesheet: null,

	getDefaultSettings: function() {
		return {
			id: 0
		};
	},

	getDefaultElements: function() {
		return {
			$stylesheetElement: Backbone.$( '<style>', { id: 'kitbuilder-style-' + this.getSettings( 'id' ) } )
		};
	},

	initStylesheet: function() {
		var viewportBreakpoints = kitbuilder.config.viewportBreakpoints;

		this.stylesheet = new Stylesheet();

		this.stylesheet
			.addDevice( 'mobile', 0 )
			.addDevice( 'tablet', viewportBreakpoints.md )
			.addDevice( 'desktop', viewportBreakpoints.lg );
	},

	addStyleRules: function( controls, values, controlsStack, placeholders, replacements ) {
		var self = this;

		_.each( controls, function( control ) {
			if ( control.styleFields ) {
				values[ control.name ].each( function( itemModel ) {
					self.addStyleRules(
						control.styleFields,
						itemModel.attributes,
						controlsStack,
						placeholders.concat( [ '{{CURRENT_ITEM}}' ] ),
						replacements.concat( [ '.kitbuilder-repeater-item-' + itemModel.get( '_id' ) ] )
					);
				} );
			}

			self.addControlStyleRules( control, values, controlsStack, placeholders, replacements );
		} );
	},

	addControlStyleRules: function( control, values, controlsStack, placeholders, replacements ) {
		var self = this;

		ControlsCSSParser.addControlStyleRules( self.stylesheet, control, controlsStack, function( control ) {
			return self.getStyleControlValue( control, values );
		}, placeholders, replacements );
	},

	getStyleControlValue: function( control, values ) {
		var value = values[ control.name ];

		if ( control.selectors_dictionary ) {
			value = control.selectors_dictionary[ value ] || value;
		}

		if ( ! _.isNumber( value ) && _.isEmpty( value ) ) {
			return;
		}

		return value;
	},

	addStyleToDocument: function() {
		kitbuilder.$previewContents.find( 'head' ).append( this.elements.$stylesheetElement );

		this.elements.$stylesheetElement.text( this.stylesheet );
	},

	removeStyleFromDocument: function() {
		this.elements.$stylesheetElement.remove();
	},

	onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );

		this.initStylesheet();
	}
} );

ControlsCSSParser.addControlStyleRules = function( stylesheet, control, controlsStack, valueCallback, placeholders, replacements ) {
	var value = valueCallback( control );

	if ( undefined === value ) {
		return;
	}

	_.each( control.selectors, function( cssProperty, selector ) {
		var outputCssProperty;

		try {
			outputCssProperty = cssProperty.replace( /\{\{(?:([^.}]+)\.)?([^}]*)}}/g, function( originalPhrase, controlName, placeholder ) {
				var parserControl = control,
					valueToInsert = value;

				if ( controlName ) {
					parserControl = _.findWhere( controlsStack, { name: controlName } );

					valueToInsert = valueCallback( parserControl );
				}

				var parsedValue = kitbuilder.getControlView( parserControl.type ).getStyleValue( placeholder.toLowerCase(), valueToInsert );

				if ( '' === parsedValue ) {
					throw '';
				}

				return parsedValue;
			} );
		} catch ( e ) {
			return;
		}

		if ( _.isEmpty( outputCssProperty ) ) {
			return;
		}

		var devicePattern = /^(?:\([^)]+\)){1,2}/,
			deviceRules = selector.match( devicePattern ),
			query = {};

		if ( deviceRules ) {
			deviceRules = deviceRules[0];

			selector = selector.replace( devicePattern, '' );

			var pureDevicePattern = /\(([^)]+)\)/g,
				pureDeviceRules = [],
				matches;

			while ( matches = pureDevicePattern.exec( deviceRules ) ) {
				pureDeviceRules.push( matches[1] );
			}

			_.each( pureDeviceRules, function( deviceRule ) {
				if ( 'desktop' === deviceRule ) {
					return;
				}

				var device = deviceRule.replace( /\+$/, '' ),
					endPoint = device === deviceRule ? 'max' : 'min';

				query[ endPoint ] = device;
			} );
		}

		_.each( placeholders, function( placeholder, index ) {
			var placeholderPattern = new RegExp( placeholder, 'g' );

			selector = selector.replace( placeholderPattern, replacements[ index ] );
		} );

		if ( ! Object.keys( query ).length && control.responsive ) {
			query = kitbuilder.helpers.cloneObject( control.responsive );

			if ( 'desktop' === query.max ) {
				delete query.max;
			}
		}

		stylesheet.addRules( selector, outputCssProperty, query );
	} );
};

module.exports = ControlsCSSParser;

},{"kitbuilder-editor-utils/stylesheet":67,"kitbuilder-utils/view-module":104}],58:[function(require,module,exports){
var heartbeat;

heartbeat = {

	init: function() {
		var modal;

		this.getModal = function() {
			if ( ! modal ) {
				modal = this.initModal();
			}

			return modal;
		};

		Backbone.$( document ).on( {
			'heartbeat-send': function( event, data ) {
				data.kitbuilder_post_lock = {
					post_ID: kitbuilder.config.post_id
				};
			},
			'heartbeat-tick': function( event, response ) {
				if ( response.locked_user ) {
					if ( kitbuilder.isEditorChanged() ) {
						kitbuilder.saveEditor( { status: 'autosave' } );
					}

					heartbeat.showLockMessage( response.locked_user );
				} else {
					heartbeat.getModal().hide();
				}

				kitbuilder.config.nonce = response.kitbuilder_nonce;
			}
		} );

		if ( kitbuilder.config.locked_user ) {
			heartbeat.showLockMessage( kitbuilder.config.locked_user );
		}
	},

	initModal: function() {
		var modal = kitbuilder.dialogsManager.createWidget( 'options', {
			headerMessage: kitbuilder.translate( 'take_over' )
		} );

		modal.addButton( {
			name: 'go_back',
			text: kitbuilder.translate( 'go_back' ),
			callback: function() {
				parent.history.go( -1 );
			}
		} );

		modal.addButton( {
			name: 'take_over',
			text: kitbuilder.translate( 'take_over' ),
			callback: function() {
				wp.heartbeat.enqueue( 'kitbuilder_force_post_lock', true );
				wp.heartbeat.connectNow();
			}
		} );

		return modal;
	},

	showLockMessage: function( lockedUser ) {
		var modal = heartbeat.getModal();

		modal
			.setMessage( kitbuilder.translate( 'dialog_user_taken_over', [ lockedUser ] ) )
		    .show();
	}
};

module.exports = heartbeat;

},{}],59:[function(require,module,exports){
var helpers;

helpers = {
	_enqueuedFonts: [],

	elementsHierarchy: {
		section: {
			column: {
				widget: null,
				section: null
			}
		}
	},

	enqueueFont: function( font ) {
		if ( -1 !== this._enqueuedFonts.indexOf( font ) ) {
			return;
		}

		var fontType = kitbuilder.config.controls.font.fonts[ font ],
			fontUrl,

			subsets = {
				'ru_RU': 'cyrillic',
				'uk': 'cyrillic',
				'bg_BG': 'cyrillic',
				'vi': 'vietnamese',
				'el': 'greek',
				'he_IL': 'hebrew'
			};

		switch ( fontType ) {
			case 'googlefonts' :
				fontUrl = 'https://fonts.googleapis.com/css?family=' + font + ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

				if ( subsets[ kitbuilder.config.locale ] ) {
					fontUrl += '&subset=' + subsets[ kitbuilder.config.locale ];
				}

				break;

			case 'earlyaccess' :
				var fontLowerString = font.replace( /\s+/g, '' ).toLowerCase();
				fontUrl = 'https://fonts.googleapis.com/earlyaccess/' + fontLowerString + '.css';
				break;
		}

		if ( ! _.isEmpty( fontUrl ) ) {
			kitbuilder.$previewContents.find( 'link:last' ).after( '<link href="' + fontUrl + '" rel="stylesheet" type="text/css">' );
		}
		this._enqueuedFonts.push( font );
	},

	getElementChildType: function( elementType, container ) {
		if ( ! container ) {
			container = this.elementsHierarchy;
		}

		if ( undefined !== container[ elementType ] ) {

			if ( Backbone.$.isPlainObject( container[ elementType ] ) ) {
				return Object.keys( container[ elementType ] );
			}

			return null;
		}

		for ( var type in container ) {

			if ( ! container.hasOwnProperty( type ) ) {
				continue;
			}

			if ( ! Backbone.$.isPlainObject( container[ type ] ) ) {
				continue;
			}

			var result = this.getElementChildType( elementType, container[ type ] );

			if ( result ) {
				return result;
			}
		}

		return null;
	},

	getUniqueID: function() {
		var id;

		// TODO: Check conflict models
		//while ( true ) {
			id = Math.random().toString( 36 ).substr( 2, 7 );
			//if ( 1 > $( 'li.item-id-' + id ).length ) {
				return id;
			//}
		//}
	},

	stringReplaceAll: function( string, replaces ) {
		var re = new RegExp( Object.keys( replaces ).join( '|' ), 'gi' );

		return string.replace( re, function( matched ) {
			return replaces[ matched ];
		} );
	},

	isActiveControl: function( controlModel, values ) {
		var condition;

		// TODO: Better way to get this?
		if ( _.isFunction( controlModel.get ) ) {
			condition = controlModel.get( 'condition' );
		} else {
			condition = controlModel.condition;
		}

		// Repeater items conditions
		if ( controlModel.conditions ) {
			return kitbuilder.conditions.check( controlModel.conditions, values );
		}

		if ( _.isEmpty( condition ) ) {
			return true;
		}

		var hasFields = _.filter( condition, function( conditionValue, conditionName ) {
			var conditionNameParts = conditionName.match( /([a-z_0-9]+)(?:\[([a-z_]+)])?(!?)$/i ),
				conditionRealName = conditionNameParts[1],
				conditionSubKey = conditionNameParts[2],
				isNegativeCondition = !! conditionNameParts[3],
				controlValue = values[ conditionRealName ];

			if ( conditionSubKey ) {
				controlValue = controlValue[ conditionSubKey ];
			}

			// If it's a non empty array - check if the conditionValue contains the controlValue,
			// If the controlValue is a non empty array - check if the controlValue contains the conditionValue
			// otherwise check if they are equal. ( and give the ability to check if the value is an empty array )
			var isContains;
			if ( _.isArray( conditionValue ) && ! _.isEmpty( conditionValue ) ) {
				isContains = _.contains( conditionValue, controlValue );
			} else if ( _.isArray( controlValue ) && ! _.isEmpty( controlValue ) ) {
				isContains = _.contains( controlValue, conditionValue );
			} else {
				isContains = _.isEqual( conditionValue, controlValue );
			}

			return isNegativeCondition ? isContains : ! isContains;
		} );

		return _.isEmpty( hasFields );
	},

	cloneObject: function( object ) {
		return JSON.parse( JSON.stringify( object ) );
	},

	getYoutubeIDFromURL: function( url ) {
		var videoIDParts = url.match( /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/ );

		return videoIDParts && videoIDParts[1];
	},

	disableElementEvents: function( $element ) {
		$element.each( function() {
			var currentPointerEvents = this.style.pointerEvents;

			if ( 'none' === currentPointerEvents ) {
				return;
			}

			Backbone.$( this )
				.data( 'backup-pointer-events', currentPointerEvents )
				.css( 'pointer-events', 'none' );
		} );
	},

	enableElementEvents: function( $element ) {
		$element.each( function() {
			var $this = Backbone.$( this ),
				backupPointerEvents = $this.data( 'backup-pointer-events' );

			if ( undefined === backupPointerEvents ) {
				return;
			}

			$this
				.removeData( 'backup-pointer-events' )
				.css( 'pointer-events', backupPointerEvents );
		} );
	},

	getColorPickerPaletteIndex: function( paletteKey ) {
		return [ '7', '8', '1', '5', '2', '3', '6', '4' ].indexOf( paletteKey );
	},

	wpColorPicker: function( $element, options ) {
		var self = this,
			defaultOptions = {
				width: window.innerWidth >= 1440 ? 271 : 251
			};

		if ( options ) {
			_.extend( defaultOptions, options );
		}

		return $element.wpColorPicker( defaultOptions );
	}
};

module.exports = helpers;

},{}],60:[function(require,module,exports){
var HotKeys = function( $ ) {
	var self = this,
		hotKeysHandlers = {};

	var keysDictionary = {
		del: 46,
		d: 68,
		l: 76,
		m: 77,
		p: 80,
		s: 83
	};

	var isMac = function() {
		return -1 !== navigator.userAgent.indexOf( 'Mac OS X' );
	};

	var initHotKeysHandlers = function() {

		hotKeysHandlers[ keysDictionary.del ] = {
			deleteElement: {
				isWorthHandling: function( event ) {
					var isEditorOpen = 'editor' === kitbuilder.getPanelView().getCurrentPageName(),
						isInputTarget = $( event.target ).is( ':input' );

					return isEditorOpen && ! isInputTarget;
				},
				handle: function() {
					kitbuilder.getPanelView().getCurrentPageView().getOption( 'editedElementView' ).confirmRemove();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.d ] = {
			/* Waiting for CTRL+Z / CTRL+Y
			duplicateElement: {
				isWorthHandling: function( event ) {
					return self.isControlEvent( event );
				},
				handle: function() {
					var panel = kitbuilder.getPanelView();

					if ( 'editor' !== panel.getCurrentPageName() ) {
						return;
					}

					panel.getCurrentPageView().getOption( 'editedElementView' ).duplicate();
				}
			}*/
		};

		hotKeysHandlers[ keysDictionary.l ] = {
			showTemplateLibrary: {
				isWorthHandling: function( event ) {
					return self.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					kitbuilder.templates.showTemplatesModal();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.m ] = {
			changeDeviceMode: {
				devices: [ 'desktop', 'tablet', 'mobile' ],
				isWorthHandling: function( event ) {
					return self.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					var currentDeviceMode = kitbuilder.channels.deviceMode.request( 'currentMode' ),
						modeIndex = this.devices.indexOf( currentDeviceMode );

					modeIndex++;

					if ( modeIndex >= this.devices.length ) {
						modeIndex = 0;
					}

					kitbuilder.changeDeviceMode( this.devices[ modeIndex ] );
				}
			}
		};

		hotKeysHandlers[ keysDictionary.p ] = {
			changeEditMode: {
				isWorthHandling: function( event ) {
					return self.isControlEvent( event );
				},
				handle: function() {
					kitbuilder.getPanelView().modeSwitcher.currentView.toggleMode();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.s ] = {
			saveEditor: {
				isWorthHandling: function( event ) {
					return self.isControlEvent( event );
				},
				handle: function() {
					kitbuilder.getPanelView().getFooterView()._publishBuilder();
				}
			}
		};
	};

	var applyHotKey = function( event ) {
		var handlers = hotKeysHandlers[ event.which ];

		if ( ! handlers ) {
			return;
		}

		_.each( handlers, function( handler ) {
			if ( handler.isWorthHandling && ! handler.isWorthHandling( event ) ) {
				return;
			}

			// Fix for some keyboard sources that consider alt key as ctrl key
			if ( ! handler.allowAltKey && event.altKey ) {
				return;
			}

			event.preventDefault();

			handler.handle( event );
		} );
	};

	var bindEvents = function() {
		self.bindListener( kitbuilder.$window );
	};

	this.isControlEvent = function( event ) {
		return event[ isMac() ? 'metaKey' : 'ctrlKey' ];
	};

	this.addHotKeyHandler = function( keyCode, handlerName, handler ) {
		if ( ! hotKeysHandlers[ keyCode ] ) {
			hotKeysHandlers[ keyCode ] = {};
		}

		hotKeysHandlers[ keyCode ][ handlerName ] = handler;
	};

	this.bindListener = function( $listener ) {
		$listener.on( 'keydown', applyHotKey );
	};

	this.init = function() {
		initHotKeysHandlers();

		bindEvents();
	};
};

module.exports = new HotKeys( jQuery );

},{}],61:[function(require,module,exports){
var ImagesManager;

ImagesManager = function() {
	var self = this;

	var cache = {};

	var debounceDelay = 300;

	var registeredItems = [];

	var getNormalizedSize = function( image ) {
		var size,
			imageSize = image.size;

		if ( 'custom' === imageSize ) {
			var customDimension = image.dimension;

			if ( customDimension.width || customDimension.height ) {
				size = 'custom_' + customDimension.width + 'x' + customDimension.height;
			} else {
				return 'full';
			}
		} else {
			size = imageSize;
		}

		return size;
	};

	self.onceTriggerChange = _.once( function( model ) {
		window.setTimeout( function() {
			model.get( 'settings' ).trigger( 'change' );
		}, 700 );
	} );

	self.getImageUrl = function( image ) {
		// Register for AJAX checking
		self.registerItem( image );

		var imageUrl = self.getItem( image );

		// If it's not in cache, like a new dropped widget or a custom size - get from settings
		if ( ! imageUrl ) {

			if ( 'custom' === image.size ) {

				if ( kitbuilder.getPanelView() && 'editor' === kitbuilder.getPanelView().currentPageName && image.model ) {
					// Trigger change again, so it's will load from the cache
					self.onceTriggerChange( image.model );
				}

				return ;
			}

			// If it's a new dropped widget
			imageUrl = image.url;
		}

		return imageUrl;
	};

	self.getItem = function( image ) {
		var size = getNormalizedSize( image ),
			id =  image.id;

		if ( ! size ) {
			return false;
		}

		if ( cache[ id ] && cache[ id ][ size ] ) {
			return cache[ id ][ size ];
		}

		return false;
	};

	self.registerItem = function( image ) {
		if ( '' === image.id ) {
			// It's a new dropped widget
			return;
		}

		if ( self.getItem( image ) ) {
			// It's already in cache
			return;
		}

		registeredItems.push( image );

		self.debounceGetRemoteItems();
	};

	self.getRemoteItems = function() {
		var requestedItems = [],
		registeredItemsLength = Object.keys( registeredItems ).length,
			image,
			index;

		// It's one item, so we can render it from remote server
		if ( 0 === registeredItemsLength ) {
			return;
		} else if ( 1 === registeredItemsLength ) {
			for ( index in registeredItems ) {
				image = registeredItems[ index ];
				break;
			}

			if ( image && image.model ) {
				image.model.renderRemoteServer();
				return;
			}
		}

		for ( index in registeredItems ) {
			image = registeredItems[ index ];

			var size = getNormalizedSize( image ),
				id = image.id,
				isFirstTime = ! cache[ id ] || 0 === Object.keys( cache[ id ] ).length;

			requestedItems.push( {
				id: id,
				size: size,
				is_first_time: isFirstTime
			} );
		}

		window.kitbuilder.ajax.send(
			'get_images_details', {
				data: {
					items: requestedItems
				},
				success: function( data ) {
					var id,
						size;

					for ( id in data ) {
						if ( ! cache[ id ] ) {
							cache[ id ] = {};
						}

						for ( size in data[ id ] ) {
							cache[ id ][ size ] = data[ id ][ size ];
						}
					}
					registeredItems = [];
				}
			}
		);
	};

	self.debounceGetRemoteItems = _.debounce( self.getRemoteItems, debounceDelay );
};

module.exports = new ImagesManager();

},{}],62:[function(require,module,exports){
var Introduction;

Introduction = function() {
	var self = this,
		modal;

	var initModal = function() {
		modal = kitbuilder.dialogsManager.createWidget( 'lightbox', {
			id: 'kitbuilder-introduction',
			closeButton: true
		} );

		modal.getElements( 'closeButton' ).on( 'click', function() {
			self.setIntroductionViewed();
		} );

		modal.on( 'hide', function() {
			modal.getElements( 'message' ).empty(); // In order to stop the video
		} );
	};

	this.getSettings = function() {
		return kitbuilder.config.introduction;
	};

	this.getModal = function() {
		if ( ! modal ) {
			initModal();
		}

		return modal;
	};

	this.startIntroduction = function() {
		var settings = this.getSettings();

		this.getModal()
		    .setHeaderMessage( settings.title )
		    .setMessage( settings.content )
		    .show();
	};

	this.startOnLoadIntroduction = function() {
		var settings = this.getSettings();

		if ( ! settings.is_user_should_view ) {
			return;
		}

		setTimeout( _.bind( function() {
			this.startIntroduction();
		}, this ), settings.delay );
	};

	this.setIntroductionViewed = function() {
		kitbuilder.ajax.send( 'introduction_viewed' );
	};
};

module.exports = new Introduction();

},{}],63:[function(require,module,exports){
/**
 * HTML5 - Drag and Drop
 */
;(function( $ ) {

	var hasFullDataTransferSupport = function( event ) {
		try {
			event.originalEvent.dataTransfer.setData( 'test', 'test' );

			event.originalEvent.dataTransfer.clearData( 'test' );

			return true;
		} catch ( e ) {
			return false;
		}
	};

	var Draggable = function( userSettings ) {
		var self = this,
			settings = {},
			elementsCache = {},
			defaultSettings = {
				element: '',
				groups: null,
				onDragStart: null,
				onDragEnd: null
			};

		var initSettings = function() {
			$.extend( true, settings, defaultSettings, userSettings );
		};

		var initElementsCache = function() {
			elementsCache.$element = $( settings.element );
		};

		var buildElements = function() {
			elementsCache.$element.attr( 'draggable', true );
		};

		var onDragEnd = function( event ) {
			if ( $.isFunction( settings.onDragEnd ) ) {
				settings.onDragEnd.call( elementsCache.$element, event, self );
			}
		};

		var onDragStart = function( event ) {
			var groups = settings.groups || [],
				dataContainer = {
					groups: groups
				};

			if ( hasFullDataTransferSupport( event ) ) {
				event.originalEvent.dataTransfer.setData( JSON.stringify( dataContainer ), true );
			}

			if ( $.isFunction( settings.onDragStart ) ) {
				settings.onDragStart.call( elementsCache.$element, event, self );
			}
		};

		var attachEvents = function() {
			elementsCache.$element
				.on( 'dragstart', onDragStart )
				.on( 'dragend', onDragEnd );
		};

		var init = function() {
			initSettings();

			initElementsCache();

			buildElements();

			attachEvents();
		};

		this.destroy = function() {
			elementsCache.$element.off( 'dragstart', onDragStart );

			elementsCache.$element.removeAttr( 'draggable' );
		};

		init();
	};

	var Droppable = function( userSettings ) {
		var self = this,
			settings = {},
			elementsCache = {},
			defaultSettings = {
				element: '',
				items: '>',
				horizontalSensitivity: '10%',
				axis: [ 'vertical', 'horizontal' ],
				groups: null,
				isDroppingAllowed: null,
				onDragEnter: null,
				onDragging: null,
				onDropping: null,
				onDragLeave: null
			};

		var initSettings = function() {
			$.extend( settings, defaultSettings, userSettings );
		};

		var initElementsCache = function() {
			elementsCache.$element = $( settings.element );
		};

		var hasHorizontalDetection = function() {
			return -1 !== settings.axis.indexOf( 'horizontal' );
		};

		var hasVerticalDetection = function() {
			return -1 !== settings.axis.indexOf( 'vertical' );
		};

		var checkHorizontal = function( offsetX, elementWidth ) {
			var isPercentValue,
				sensitivity;

			if ( ! hasHorizontalDetection() ) {
				return false;
			}

			if ( ! hasVerticalDetection() ) {
				return offsetX > elementWidth / 2 ? 'right' : 'left';
			}

			sensitivity = settings.horizontalSensitivity.match( /\d+/ );

			if ( ! sensitivity ) {
				return false;
			}

			sensitivity = sensitivity[ 0 ];

			isPercentValue = /%$/.test( settings.horizontalSensitivity );

			if ( isPercentValue ) {
				sensitivity = elementWidth / sensitivity;
			}

			if ( offsetX > elementWidth - sensitivity ) {
				return 'right';
			} else if ( offsetX < sensitivity ) {
				return 'left';
			}

			return false;
		};

		var getSide = function( element, event ) {
			var $element,
				thisHeight,
				thisWidth,
				side;

			event = event.originalEvent;

			$element = $( element );
			thisHeight = $element.outerHeight();
			thisWidth = $element.outerWidth();

			if ( side = checkHorizontal( event.offsetX, thisWidth ) ) {
				return side;
			}

			if ( ! hasVerticalDetection() ) {
				return false;
			}

			if ( event.offsetY > thisHeight / 2 ) {
				side = 'bottom';
			} else {
				side = 'top';
			}

			return side;
		};

		var isDroppingAllowed = function( element, side, event ) {
			var dataTransferTypes,
				draggableGroups,
				isGroupMatch,
				isDroppingAllowed;

			if ( settings.groups && hasFullDataTransferSupport( event ) ) {

				dataTransferTypes = event.originalEvent.dataTransfer.types;
				isGroupMatch = false;

				dataTransferTypes = Array.prototype.slice.apply( dataTransferTypes ); // Convert to array, since Firefox hold him as DOMStringList

				dataTransferTypes.forEach( function( type ) {
					try {
						draggableGroups = JSON.parse( type );

						if ( ! draggableGroups.groups.slice ) {
							return;
						}

						settings.groups.forEach( function( groupName ) {

							if ( -1 !== draggableGroups.groups.indexOf( groupName ) ) {
								isGroupMatch = true;
								return false; // stops the forEach from extra loops
							}
						} );
					} catch ( e ) {
					}
				} );

				if ( ! isGroupMatch ) {
					return false;
				}
			}

			if ( $.isFunction( settings.isDroppingAllowed ) ) {

				isDroppingAllowed = settings.isDroppingAllowed.call( element, side, event, self );

				if ( ! isDroppingAllowed ) {
					return false;
				}
			}

			return true;
		};

		var onDragEnter = function( event ) {
			if ( event.target !== this ) {
				return;
			}

			// Avoid internal elements event firing
			$( this ).children().each( function() {
				var currentPointerEvents = this.style.pointerEvents;

				if ( 'none' === currentPointerEvents ) {
					return;
				}

				$( this )
					.data( 'backup-pointer-events', currentPointerEvents )
					.css( 'pointer-events', 'none' );
			} );

			var side = getSide( this, event );

			if ( ! isDroppingAllowed( this, side, event ) ) {
				return;
			}

			if ( $.isFunction( settings.onDragEnter ) ) {
				settings.onDragEnter.call( this, side, event, self );
			}
		};

		var onDragOver = function( event ) {
			var side = getSide( this, event );

			if ( ! isDroppingAllowed( this, side, event ) ) {
				return;
			}

			event.preventDefault();

			if ( $.isFunction( settings.onDragging ) ) {
				settings.onDragging.call( this, side, event, self );
			}
		};

		var onDrop = function( event ) {
			var side = getSide( this, event );

			if ( ! isDroppingAllowed( this, side, event ) ) {
				return;
			}

			event.preventDefault();

			if ( $.isFunction( settings.onDropping ) ) {
				settings.onDropping.call( this, side, event, self );
			}
		};

		var onDragLeave = function( event ) {
			// Avoid internal elements event firing
			$( this ).children().each( function() {
				var $this = $( this ),
					backupPointerEvents = $this.data( 'backup-pointer-events' );

				if ( undefined === backupPointerEvents ) {
					return;
				}

				$this
					.removeData( 'backup-pointer-events' )
					.css( 'pointer-events', backupPointerEvents );
			} );

			if ( $.isFunction( settings.onDragLeave ) ) {
				settings.onDragLeave.call( this, event, self );
			}
		};

		var attachEvents = function() {
			elementsCache.$element
				.on( 'dragenter', settings.items, onDragEnter )
				.on( 'dragover', settings.items, onDragOver )
				.on( 'drop', settings.items, onDrop )
				.on( 'dragleave drop', settings.items, onDragLeave );
		};

		var init = function() {
			initSettings();

			initElementsCache();

			attachEvents();
		};

		this.destroy = function() {
			elementsCache.$element
				.off( 'dragenter', settings.items, onDragEnter )
				.off( 'dragover', settings.items, onDragOver )
				.off( 'drop', settings.items, onDrop )
				.off( 'dragleave drop', settings.items, onDragLeave );
		};

		init();
	};

	var plugins = {
		html5Draggable: Draggable,
		html5Droppable: Droppable
	};

	$.each( plugins, function( pluginName, Plugin ) {
		$.fn[ pluginName ] = function( options ) {
			options = options || {};

			this.each( function() {
				var instance = $.data( this, pluginName ),
					hasInstance = instance instanceof Plugin;

				if ( hasInstance ) {

					if ( 'destroy' === options ) {

						instance.destroy();

						$.removeData( this, pluginName );
					}

					return;
				}

				options.element = this;

				$.data( this, pluginName, new Plugin( options ) );
			} );

			return this;
		};
	} );
})( jQuery );

},{}],64:[function(require,module,exports){
/*!
 * jQuery Serialize Object v1.0.1
 */
(function( $ ) {
	$.fn.kitbuilderSerializeObject = function() {
		var serializedArray = this.serializeArray(),
			data = {};

		var parseObject = function( dataContainer, key, value ) {
			var isArrayKey = /^[^\[\]]+\[]/.test( key ),
				isObjectKey = /^[^\[\]]+\[[^\[\]]+]/.test( key ),
				keyName = key.replace( /\[.*/, '' );

			if ( isArrayKey ) {
				if ( ! dataContainer[ keyName ] ) {
					dataContainer[ keyName ] = [];
				}
			} else {
				if ( ! isObjectKey ) {
					if ( dataContainer.push ) {
						dataContainer.push( value );
					} else {
						dataContainer[ keyName ] = value;
					}

					return;
				}

				if ( ! dataContainer[ keyName ] ) {
					dataContainer[ keyName ] = {};
				}
			}

			var nextKeys = key.match( /\[[^\[\]]*]/g );

			nextKeys[ 0 ] = nextKeys[ 0 ].replace( /\[|]/g, '' );

			return parseObject( dataContainer[ keyName ], nextKeys.join( '' ), value );
		};

		$.each( serializedArray, function() {
			parseObject( data, this.name, this.value );
		} );
		return data;
	};
})( jQuery );

},{}],65:[function(require,module,exports){
var ViewModule = require( 'kitbuilder-utils/view-module' ),
	SettingsModel = require( 'kitbuilder-models/base-settings' ),
	ControlsCSSParser = require( 'kitbuilder-editor-utils/controls-css-parser' );

module.exports = ViewModule.extend( {
	controlsCSS: null,

	model: null,

	hasChange: false,

	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = kitbuilderFrontend.getElements( '$document' ).find( kitbuilder.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			this.save( function() {
				kitbuilder.reloadPreview();

				kitbuilder.once( 'preview:loaded', function() {
					kitbuilder.getPanelView().setPage( 'settingsPage' );
				} );
			} );
		}
	},

	addChangeCallback: function( attribute, callback ) {
		this.changeCallbacks[ attribute ] = callback;
	},

	getDefaultSettings: function() {
		return {
			savedSettings: kitbuilder.config.page_settings.settings
		};
	},

	bindEvents: function() {
		kitbuilder.on( 'preview:loaded', this.updateStylesheet );

		this.model.on( 'change', this.onModelChange );
	},

	renderStyles: function() {
		this.controlsCSS.addStyleRules( this.model.getStyleControls(), this.model.attributes, this.model.controls, [ /\{\{WRAPPER}}/g ], [ 'body.kitbuilder-page-' + kitbuilder.config.post_id ] );
	},

	updateStylesheet: function() {
		this.renderStyles();

		this.controlsCSS.addStyleToDocument();
	},

	initModel: function() {
		this.model = new SettingsModel( this.getSettings( 'savedSettings' ), {
			controls: kitbuilder.config.page_settings.controls
		} );
	},

	initControlsCSSParser: function() {
		this.controlsCSS = new ControlsCSSParser();
	},

	save: function( callback ) {
		var self = this;

		if ( ! self.hasChange ) {
			return;
		}

		var settings = self.model.toJSON();

		settings.id = kitbuilder.config.post_id;

		NProgress.start();

		kitbuilder.ajax.send( 'save_page_settings', {
			data: settings,
			success: function() {
				NProgress.done();

				self.setSettings( 'savedSettings', settings );

				self.hasChange = false;

				if ( callback ) {
					callback.apply( self, arguments );
				}
			},
			error: function() {
				alert( 'An error occurred' );
			}
		} );
	},

	onInit: function() {
		this.initModel();

		this.initControlsCSSParser();

		this.debounceSave = _.debounce( this.save, 3000 );

		ViewModule.prototype.onInit.apply( this, arguments );
	},

	onModelChange: function( model ) {
		var self = this;

		self.hasChange = true;

		this.controlsCSS.stylesheet.empty();

		_.each( model.changed, function( value, key ) {
			if ( self.changeCallbacks[ key ] ) {
				self.changeCallbacks[ key ].call( self, value );
			}
		} );

		self.updateStylesheet();

		self.debounceSave();
	}
} );

},{"kitbuilder-editor-utils/controls-css-parser":57,"kitbuilder-models/base-settings":50,"kitbuilder-utils/view-module":104}],66:[function(require,module,exports){
var presetsFactory;

presetsFactory = {

	getPresetsDictionary: function() {
		return {
			11: 100 / 9,
			12: 100 / 8,
			14: 100 / 7,
			16: 100 / 6,
			33: 100 / 3,
			66: 2 / 3 * 100,
			83: 5 / 6 * 100
		};
	},

	getAbsolutePresetValues: function( preset ) {
		var clonedPreset = kitbuilder.helpers.cloneObject( preset ),
			presetDictionary = this.getPresetsDictionary();

		_.each( clonedPreset, function( unitValue, unitIndex ) {
			if ( presetDictionary[ unitValue ] ) {
				clonedPreset[ unitIndex ] = presetDictionary[ unitValue ];
			}
		} );

		return clonedPreset;
	},

	getPresets: function( columnsCount, presetIndex ) {
		var presets = kitbuilder.helpers.cloneObject( kitbuilder.config.elements.section.presets );

		if ( columnsCount ) {
			presets = presets[ columnsCount ];
		}

		if ( presetIndex ) {
			presets = presets[ presetIndex ];
		}

		return presets;
	},

	getPresetByStructure: function( structure ) {
		var parsedStructure = this.getParsedStructure( structure );

		return this.getPresets( parsedStructure.columnsCount, parsedStructure.presetIndex );
	},

	getParsedStructure: function( structure ) {
		structure += ''; // Make sure this is a string

		return {
			columnsCount: structure.slice( 0, -1 ),
			presetIndex: structure.substr( -1 )
		};
	},

	getPresetSVG: function( preset, svgWidth, svgHeight, separatorWidth ) {
		svgWidth = svgWidth || 100;
		svgHeight = svgHeight || 50;
		separatorWidth = separatorWidth || 2;

		var absolutePresetValues = this.getAbsolutePresetValues( preset ),
			presetSVGPath = this._generatePresetSVGPath( absolutePresetValues, svgWidth, svgHeight, separatorWidth );

		return this._createSVGPreset( presetSVGPath, svgWidth, svgHeight );
	},

	_createSVGPreset: function( presetPath, svgWidth, svgHeight ) {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );

		svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' );
		svg.setAttribute( 'viewBox', '0 0 ' + svgWidth + ' ' + svgHeight );

		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

		path.setAttribute( 'd', presetPath );

		svg.appendChild( path );

		return svg;
	},

	_generatePresetSVGPath: function( preset, svgWidth, svgHeight, separatorWidth ) {
		var DRAW_SIZE = svgWidth - separatorWidth * ( preset.length - 1 );

		var xPointer = 0,
			dOutput = '';

		for ( var i = 0; i < preset.length; i++ ) {
			if ( i ) {
				dOutput += ' ';
			}

			var increment = preset[ i ] / 100 * DRAW_SIZE;

			xPointer += increment;

			dOutput += 'M' + ( +xPointer.toFixed( 4 ) ) + ',0';

			dOutput += 'V' + svgHeight;

			dOutput += 'H' + ( +( xPointer - increment ).toFixed( 4 ) );

			dOutput += 'V0Z';

			xPointer += separatorWidth;
		}

		return dOutput;
	}
};

module.exports = presetsFactory;

},{}],67:[function(require,module,exports){
( function( $ ) {

	var Stylesheet = function() {
		var self = this,
			rules = {},
			rawCSS = {},
			devices = {};

		var getDeviceMaxValue = function( deviceName ) {
			var deviceNames = Object.keys( devices ),
				deviceNameIndex = deviceNames.indexOf( deviceName ),
				nextIndex = deviceNameIndex + 1;

			if ( nextIndex >= deviceNames.length ) {
				throw new RangeError( 'Max value for this device is out of range.' );
			}

			return devices[ deviceNames[ nextIndex ] ] - 1;
		};

		var queryToHash = function( query ) {
			var hash = [];

			$.each( query, function( endPoint ) {
				hash.push( endPoint + '_' + this );
			} );

			return hash.join( '-' );
		};

		var hashToQuery = function( hash ) {
			var query = {};

			hash = hash.split( '-' ).filter( String );

			hash.forEach( function( singleQuery ) {
				var queryParts = singleQuery.split( '_' ),
					endPoint = queryParts[0],
					deviceName = queryParts[1];

				query[ endPoint ] = 'max' === endPoint ? getDeviceMaxValue( deviceName ) : devices[ deviceName ];
			} );

			return query;
		};

		var addQueryHash = function( queryHash ) {
			rules[ queryHash ] = {};

			var hashes = Object.keys( rules );

			if ( hashes.length < 2 ) {
				return;
			}

			// Sort the devices from narrowest to widest
			hashes.sort( function( a, b ) {
				if ( 'all' === a ) {
					return -1;
				}

				if ( 'all' === b ) {
					return 1;
				}

				var aQuery = hashToQuery( a ),
					bQuery = hashToQuery( b );

				return bQuery.max - aQuery.max;
			} );

			var sortedRules = {};

			hashes.forEach( function( deviceName ) {
				sortedRules[ deviceName ] = rules[ deviceName ];
			} );

			rules = sortedRules;
		};

		var getQueryHashStyleFormat = function( queryHash ) {
			var query = hashToQuery( queryHash ),
				styleFormat = [];

			$.each( query, function( endPoint ) {
				styleFormat.push( '(' + endPoint + '-width:' + this + 'px)' );
			} );

			return '@media' + styleFormat.join( ' and ' );
		};

		this.addDevice = function( deviceName, deviceValue ) {
			devices[ deviceName ] = deviceValue;

			var deviceNames = Object.keys( devices );

			if ( deviceNames.length < 2 ) {
				return self;
			}

			// Sort the devices from narrowest to widest
			deviceNames.sort( function( a, b ) {
				return devices[ a ] - devices[ b ];
			} );

			var sortedDevices = {};

			deviceNames.forEach( function( deviceName ) {
				sortedDevices[ deviceName ] = devices[ deviceName ];
			} );

			devices = sortedDevices;

			return self;
		};

		this.addRawCSS = function( key, css ) {
			rawCSS[ key ] = css;
		},

		this.addRules = function( selector, styleRules, query ) {
			var queryHash = 'all';

			if ( ! _.isEmpty( query ) ) {
				queryHash = queryToHash( query );
			}

			if ( ! rules[ queryHash ] ) {
				addQueryHash( queryHash );
			}

			if ( ! styleRules ) {
				var parsedRules = selector.match( /[^{]+\{[^}]+}/g );

				$.each( parsedRules, function() {
					var parsedRule = this.match( /([^{]+)\{([^}]+)}/ );

					if ( parsedRule ) {
						self.addRules( parsedRule[1].trim(), parsedRule[2].trim(), query );
					}
				} );

				return;
			}

			if ( ! rules[ queryHash ][ selector ] ) {
				rules[ queryHash ][ selector ] = {};
			}

			if ( 'string' === typeof styleRules ) {
				styleRules = styleRules.split( ';' ).filter( String );

				var orderedRules = {};

				$.each( styleRules, function() {
					var property = this.split( /:(.*)?/ );

					orderedRules[ property[0].trim() ] = property[1].trim().replace( ';', '' );
				} );

				styleRules = orderedRules;
			}

			$.extend( rules[ queryHash ][ selector ], styleRules );

			return self;
		};

		this.getRules = function() {
			return rules;
		};

		this.empty = function() {
			rules = {};
			rawCSS = {};
		};

		this.toString = function() {
			var styleText = '';

			$.each( rules, function( queryHash ) {
				var deviceText = Stylesheet.parseRules( this );

				if ( 'all' !== queryHash ) {
					deviceText = getQueryHashStyleFormat( queryHash ) + '{' + deviceText + '}';
				}

				styleText += deviceText;
			} );

			$.each( rawCSS, function() {
				styleText += this;
			} );

			return styleText;
		};
	};

	Stylesheet.parseRules = function( rules ) {
		var parsedRules = '';

		$.each( rules, function( selector ) {
			var selectorContent = Stylesheet.parseProperties( this );

			if ( selectorContent ) {
				parsedRules += selector + '{' + selectorContent + '}';
			}
		} );

		return parsedRules;
	};

	Stylesheet.parseProperties = function( properties ) {
		var parsedProperties = '';

		$.each( properties, function( propertyKey ) {
			if ( this ) {
				parsedProperties += propertyKey + ':' + this + ';';
			}
		} );

		return parsedProperties;
	};

	module.exports = Stylesheet;
} )( jQuery );

},{}],68:[function(require,module,exports){
var BaseSettingsModel = require( 'kitbuilder-models/base-settings' ),
	ControlsCSSParser = require( 'kitbuilder-editor-utils/controls-css-parser' ),
	BaseElementView;

BaseElementView = Marionette.CompositeView.extend( {
	tagName: 'div',

	controlsCSSParser: null,

	className: function() {
		return this.getElementUniqueID();
	},

	attributes: function() {
		var type = this.model.get( 'elType' );

		if ( 'widget'  === type ) {
			type = this.model.get( 'widgetType' );
		}

		return {
			'data-id': this.getID(),
			'data-element_type': type
		};
	},

	ui: function() {
		return {
			duplicateButton: '> .kitbuilder-editor-element-settings .kitbuilder-editor-element-duplicate',
			removeButton: '> .kitbuilder-editor-element-settings .kitbuilder-editor-element-remove',
			saveButton: '> .kitbuilder-editor-element-settings .kitbuilder-editor-element-save'
		};
	},

	events: function() {
		return {
			'click @ui.removeButton': 'onClickRemove',
			'click @ui.saveButton': 'onClickSave',
			'click @ui.duplicateButton': 'onClickDuplicate'
		};
	},

	getElementType: function() {
		return this.model.get( 'elType' );
	},

	getChildType: function() {
		return kitbuilder.helpers.getElementChildType( this.getElementType() );
	},

	getChildView: function( model ) {
		var ChildView,
			elType = model.get( 'elType' );

		if ( 'section' === elType ) {
			ChildView = require( 'kitbuilder-views/section' );
		} else if ( 'column' === elType ) {
			ChildView = require( 'kitbuilder-views/column' );
		} else {
			ChildView = kitbuilder.modules.WidgetView;
		}

		return kitbuilder.hooks.applyFilters( 'element/view', ChildView, model, this );
	},

	templateHelpers: function() {
		return {
			elementModel: this.model,
			editModel: this.getEditModel()
		};
	},

	getTemplateType: function() {
		return 'js';
	},

	getEditModel: function() {
		return this.model;
	},

	initialize: function() {
		// grab the child collection from the parent model
		// so that we can render the collection as children
		// of this parent element
		this.collection = this.model.get( 'elements' );

		if ( this.collection ) {
			this.listenTo( this.collection, 'add remove reset', this.onCollectionChanged, this );
		}

		var editModel = this.getEditModel();

		this.listenTo( editModel.get( 'settings' ), 'change', this.onSettingsChanged, this );
		this.listenTo( editModel.get( 'editSettings' ), 'change', this.onEditSettingsChanged, this );

		this.on( 'render', function() {
			this.renderUI();
			this.runReadyTrigger();
		} );

		this.initRemoveDialog();

		this.initControlsCSSParser();
	},

	edit: function() {
		kitbuilder.getPanelView().openEditor( this.getEditModel(), this );
	},

	addChildModel: function( model, options ) {
		return this.collection.add( model, options, true );
	},

	addChildElement: function( itemData, options ) {
		options = options || {};

		var myChildType = this.getChildType();

		if ( -1 === myChildType.indexOf( itemData.elType ) ) {
			delete options.at;

			return this.children.last().addChildElement( itemData, options );
		}

		var newModel = this.addChildModel( itemData, options ),
			newView = this.children.findByModel( newModel );

		if ( 'section' === newView.getElementType() && newView.isInner() ) {
			newView.addEmptyColumn();
		}

		newView.edit();

		return newView;
	},

	addElementFromPanel: function( options ) {
		var elementView = kitbuilder.channels.panelElements.request( 'element:selected' );

		var itemData = {
			id: kitbuilder.helpers.getUniqueID(),
			elType: elementView.model.get( 'elType' )
		};

		if ( 'widget' === itemData.elType ) {
			itemData.widgetType = elementView.model.get( 'widgetType' );
		} else if ( 'section' === itemData.elType ) {
			itemData.elements = [];
			itemData.isInner = true;
		} else {
			return;
		}

		var customData = elementView.model.get( 'custom' );

		if ( customData ) {
			_.extend( itemData, customData );
		}

		this.addChildElement( itemData, options );
	},

	isCollectionFilled: function() {
		return false;
	},

	isInner: function() {
		return !! this.model.get( 'isInner' );
	},

	initRemoveDialog: function() {
		var removeDialog;

		this.getRemoveDialog = function() {
			if ( ! removeDialog ) {
				var elementTitle = this.model.getTitle();

				removeDialog = kitbuilder.dialogsManager.createWidget( 'confirm', {
					message: kitbuilder.translate( 'dialog_confirm_delete', [ elementTitle.toLowerCase() ] ),
					headerMessage: kitbuilder.translate( 'delete_element', [ elementTitle ] ),
					strings: {
						confirm: kitbuilder.translate( 'delete' ),
						cancel: kitbuilder.translate( 'cancel' )
					},
					defaultOption: 'confirm',
					onConfirm: _.bind( function() {
						var parent = this._parent;

						parent.isManualRemoving = true;

						this.model.destroy();

						parent.isManualRemoving = false;
					}, this )
				} );
			}

			return removeDialog;
		};
	},

	initControlsCSSParser: function() {
		this.controlsCSSParser = new ControlsCSSParser( { id: this.model.cid } );
	},

	enqueueFonts: function() {
		var editModel = this.getEditModel(),
			settings = editModel.get( 'settings' );

		_.each( settings.getFontControls(), _.bind( function( control ) {
			var fontFamilyName = editModel.getSetting( control.name );

			if ( _.isEmpty( fontFamilyName ) ) {
				return;
			}

			kitbuilder.helpers.enqueueFont( fontFamilyName );
		}, this ) );
	},

	renderStyles: function() {
		var self = this,
			settings = self.getEditModel().get( 'settings' );

		self.controlsCSSParser.stylesheet.empty();

		self.controlsCSSParser.addStyleRules( settings.getStyleControls(), settings.attributes, self.getEditModel().get( 'settings' ).controls, [ /\{\{ID}}/g, /\{\{WRAPPER}}/g ], [ self.getID(), '#kitbuilder .' + self.getElementUniqueID() ] );

		if ( 'column' === self.model.get( 'elType' ) ) {
			var inlineSize = settings.get( '_inline_size' );

			if ( ! _.isEmpty( inlineSize ) ) {
				self.controlsCSSParser.stylesheet.addRules( '#kitbuilder .' + self.getElementUniqueID(), { width: inlineSize + '%' }, { min: 'tablet' } );
			}
		}

		self.controlsCSSParser.addStyleToDocument();

		var extraCSS = kitbuilder.hooks.applyFilters( 'editor/style/styleText', '', this );

		if ( extraCSS ) {
			self.controlsCSSParser.elements.$stylesheetElement.append( extraCSS );
		}
	},

	renderCustomClasses: function() {
		var self = this;

		self.$el.addClass( 'kitbuilder-element' );

		var settings = self.getEditModel().get( 'settings' ),
			classControls = settings.getClassControls();

		// Remove all previous classes
		_.each( classControls, function( control ) {
			var previousClassValue = settings.previous( control.name );

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ previousClassValue ] ) {
					previousClassValue = control.classes_dictionary[ previousClassValue ];
				}
			}

			self.$el.removeClass( control.prefix_class + previousClassValue );
		} );

		// Add new classes
		_.each( classControls, function( control ) {
			var value = settings.attributes[ control.name ],
				classValue = value;

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ value ] ) {
					classValue = control.classes_dictionary[ value ];
				}
			}

			var isVisible = kitbuilder.helpers.isActiveControl( control, settings.attributes );

			if ( isVisible && ! _.isEmpty( classValue ) ) {
				self.$el
					.addClass( control.prefix_class + classValue )
					.addClass( _.result( self, 'className' ) );
			}
		} );
	},

	renderCustomElementID: function() {
		var customElementID = this.getEditModel().get( 'settings' ).get( '_element_id' );

		this.$el.attr( 'id', customElementID );
	},

	renderUI: function() {
		this.renderStyles();
		this.renderCustomClasses();
		this.renderCustomElementID();
		this.enqueueFonts();
	},

	runReadyTrigger: function() {
		_.defer( _.bind( function() {
			kitbuilderFrontend.elementsHandler.runReadyTrigger( this.$el );
		}, this ) );
	},

	getID: function() {
		return this.model.get( 'id' );
	},

	getElementUniqueID: function() {
		return 'kitbuilder-element-' + this.getID();
	},

	duplicate: function() {
		this.trigger( 'request:duplicate' );
	},

	confirmRemove: function() {
		this.getRemoveDialog().show();
	},

	renderOnChange: function( settings ) {
		// Make sure is correct model
		if ( settings instanceof BaseSettingsModel ) {
			var hasChanged = settings.hasChanged(),
				isContentChanged = ! hasChanged,
				isRenderRequired = ! hasChanged;

			_.each( settings.changedAttributes(), function( settingValue, settingKey ) {
				var control = settings.getControl( settingKey );

				if ( ! control ) {
					isRenderRequired = true;

					return;
				}

				if ( 'none' !== control.render_type ) {
					isRenderRequired = true;
				}

				if ( -1 !== [ 'none', 'ui' ].indexOf( control.render_type ) ) {
					return;
				}

				if ( 'template' === control.render_type || ! settings.isStyleControl( settingKey ) && ! settings.isClassControl( settingKey ) && '_element_id' !== settingKey ) {
					isContentChanged = true;
				}
			} );

			if ( ! isRenderRequired ) {
				return;
			}

			if ( ! isContentChanged ) {
				this.renderUI();
				return;
			}
		}

		// Re-render the template
		var templateType = this.getTemplateType(),
			editModel = this.getEditModel();

		if ( 'js' === templateType ) {
			this.getEditModel().setHtmlCache();
			this.render();
			editModel.renderOnLeave = true;
		} else {
			editModel.renderRemoteServer();
		}
	},

	onCollectionChanged: function() {
		kitbuilder.setFlagEditorChange( true );
	},

	onEditSettingsChanged: function( changedModel ) {
		this.renderOnChange( changedModel );
	},

	onSettingsChanged: function( changedModel ) {
		kitbuilder.setFlagEditorChange( true );

		this.renderOnChange( changedModel );
	},

	onClickEdit: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		var activeMode = kitbuilder.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' !== activeMode ) {
			return;
		}

		this.edit();
	},

	onClickDuplicate: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.duplicate();
	},

	onClickRemove: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.confirmRemove();
	},

	onClickSave: function( event ) {
		event.preventDefault();

		var model = this.model;

		kitbuilder.templates.startModal( function() {
			kitbuilder.templates.getLayout().showSaveTemplateView( model );
		} );
	},

	onDestroy: function() {
		this.controlsCSSParser.removeStyleFromDocument();
	}
} );

module.exports = BaseElementView;

},{"kitbuilder-editor-utils/controls-css-parser":57,"kitbuilder-models/base-settings":50,"kitbuilder-views/column":70,"kitbuilder-views/section":100}],69:[function(require,module,exports){
var SectionView = require( 'kitbuilder-views/section' ),
	BaseSectionsContainerView;

BaseSectionsContainerView = Marionette.CompositeView.extend( {
	childView: SectionView,

	behaviors: {
		Sortable: {
			behaviorClass: require( 'kitbuilder-behaviors/sortable' ),
			elChildType: 'section'
		},
		HandleDuplicate: {
			behaviorClass: require( 'kitbuilder-behaviors/handle-duplicate' )
		},
		HandleAdd: {
			behaviorClass: require( 'kitbuilder-behaviors/duplicate' )
		}
	},

	getSortableOptions: function() {
		return {
			handle: '> .kitbuilder-container > .kitbuilder-row > .kitbuilder-column > .kitbuilder-element-overlay .kitbuilder-editor-section-settings-list .kitbuilder-editor-element-trigger',
			items: '> .kitbuilder-section'
		};
	},

	getChildType: function() {
		return [ 'section' ];
	},

	isCollectionFilled: function() {
		return false;
	},

	initialize: function() {
		this
			.listenTo( this.collection, 'add remove reset', this.onCollectionChanged )
			.listenTo( kitbuilder.channels.panelElements, 'element:drag:start', this.onPanelElementDragStart )
			.listenTo( kitbuilder.channels.panelElements, 'element:drag:end', this.onPanelElementDragEnd );
	},

	addChildModel: function( model, options ) {
		return this.collection.add( model, options, true );
	},

	addSection: function( properties ) {
		var newSection = {
			id: kitbuilder.helpers.getUniqueID(),
			elType: 'section',
			settings: {},
			elements: []
		};

		if ( properties ) {
			_.extend( newSection, properties );
		}

		var newModel = this.addChildModel( newSection );

		return this.children.findByModelCid( newModel.cid );
	},

	onCollectionChanged: function() {
		kitbuilder.setFlagEditorChange( true );
	},

	onPanelElementDragStart: function() {
		kitbuilder.helpers.disableElementEvents( this.$el.find( 'iframe' ) );
	},

	onPanelElementDragEnd: function() {
		kitbuilder.helpers.enableElementEvents( this.$el.find( 'iframe' ) );
	}
} );

module.exports = BaseSectionsContainerView;

},{"kitbuilder-behaviors/duplicate":1,"kitbuilder-behaviors/handle-duplicate":2,"kitbuilder-behaviors/sortable":5,"kitbuilder-views/section":100}],70:[function(require,module,exports){
var BaseElementView = require( 'kitbuilder-views/base-element' ),
	ElementEmptyView = require( 'kitbuilder-views/element-empty' ),
	ColumnView;

ColumnView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-kitbuilder-element-column-content' ),

	emptyView: ElementEmptyView,

	childViewContainer: '> .kitbuilder-column-wrap > .kitbuilder-widget-wrap',

	behaviors: {
		Sortable: {
			behaviorClass: require( 'kitbuilder-behaviors/sortable' ),
			elChildType: 'widget'
		},
		Resizable: {
			behaviorClass: require( 'kitbuilder-behaviors/resizable' )
		},
		HandleDuplicate: {
			behaviorClass: require( 'kitbuilder-behaviors/handle-duplicate' )
		},
		HandleAddMode: {
			behaviorClass: require( 'kitbuilder-behaviors/duplicate' )
		}
	},

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' kitbuilder-column kitbuilder-' + type + '-column';
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.duplicateButton = '> .kitbuilder-element-overlay .kitbuilder-editor-column-settings-list .kitbuilder-editor-element-duplicate';
		ui.removeButton = '> .kitbuilder-element-overlay .kitbuilder-editor-column-settings-list .kitbuilder-editor-element-remove';
		ui.saveButton = '> .kitbuilder-element-overlay .kitbuilder-editor-column-settings-list .kitbuilder-editor-element-save';
		ui.triggerButton = '> .kitbuilder-element-overlay .kitbuilder-editor-column-settings-list .kitbuilder-editor-element-edit-trigger';
		ui.addButton = '> .kitbuilder-element-overlay .kitbuilder-editor-column-settings-list .kitbuilder-editor-element-add';
		ui.columnTitle = '.column-title';
		ui.columnInner = '> .kitbuilder-column-wrap';
		ui.listTriggers = '> .kitbuilder-element-overlay .kitbuilder-editor-element-trigger';

		return ui;
	},

	triggers: {
		'click @ui.addButton': 'click:new'
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events[ 'click @ui.listTriggers' ] = 'onClickTrigger';
		events[ 'click @ui.triggerButton' ] = 'onClickEdit';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.listenTo( kitbuilder.channels.data, 'widget:drag:start', this.onWidgetDragStart );
		this.listenTo( kitbuilder.channels.data, 'widget:drag:end', this.onWidgetDragEnd );
	},

	isDroppingAllowed: function() {
		var elementView = kitbuilder.channels.panelElements.request( 'element:selected' ),
			elType = elementView.model.get( 'elType' );

		if ( 'section' === elType ) {
			return ! this.isInner();
		}

		return 'widget' === elType;
	},

	changeSizeUI: function() {
		var columnSize = this.model.getSetting( '_column_size' ),
			inlineSize = this.model.getSetting( '_inline_size' ),
			columnSizeTitle = parseFloat( inlineSize || columnSize ).toFixed( 1 ) + '%';

		this.$el.attr( 'data-col', columnSize );

		this.ui.columnTitle.html( columnSizeTitle );
	},

	getSortableOptions: function() {
		return {
			connectWith: '.kitbuilder-widget-wrap',
			items: '> .kitbuilder-element'
		};
	},

	// Events
	onCollectionChanged: function() {
		BaseElementView.prototype.onCollectionChanged.apply( this, arguments );

		this.changeChildContainerClasses();
	},

	changeChildContainerClasses: function() {
		var emptyClass = 'kitbuilder-element-empty',
			populatedClass = 'kitbuilder-element-populated';

		if ( this.collection.isEmpty() ) {
			this.ui.columnInner.removeClass( populatedClass ).addClass( emptyClass );
		} else {
			this.ui.columnInner.removeClass( emptyClass ).addClass( populatedClass );
		}
	},

	onRender: function() {
		var self = this;

		self.changeChildContainerClasses();
		self.changeSizeUI();

		self.$el.html5Droppable( {
			items: ' > .kitbuilder-column-wrap > .kitbuilder-widget-wrap > .kitbuilder-element, >.kitbuilder-column-wrap > .kitbuilder-widget-wrap > .kitbuilder-empty-view > .kitbuilder-first-add',
			axis: [ 'vertical' ],
			groups: [ 'kitbuilder-element' ],
			isDroppingAllowed: _.bind( self.isDroppingAllowed, self ),
			onDragEnter: function() {
				self.$el.addClass( 'kitbuilder-dragging-on-child' );
			},
			onDragging: function( side, event ) {
				event.stopPropagation();

				if ( this.dataset.side !== side ) {
					Backbone.$( this ).attr( 'data-side', side );
				}
			},
			onDragLeave: function() {
				self.$el.removeClass( 'kitbuilder-dragging-on-child' );

				Backbone.$( this ).removeAttr( 'data-side' );
			},
			onDropping: function( side, event ) {
				event.stopPropagation();

				var newIndex = Backbone.$( this ).index();

				if ( 'bottom' === side ) {
					newIndex++;
				}

				self.addElementFromPanel( { at: newIndex } );
			}
		} );
	},

	onClickTrigger: function( event ) {
		event.preventDefault();

		var $trigger = this.$( event.currentTarget ),
			isTriggerActive = $trigger.hasClass( 'kitbuilder-active' );

		this.ui.listTriggers.removeClass( 'kitbuilder-active' );

		if ( ! isTriggerActive ) {
			$trigger.addClass( 'kitbuilder-active' );
            kitbuilder.getPanelView().hideContentPanel();
		}
	},

	onWidgetDragStart: function() {
		this.$el.addClass( 'kitbuilder-dragging' );
	},

	onWidgetDragEnd: function() {
		this.$el.removeClass( 'kitbuilder-dragging' );
	}
} );

module.exports = ColumnView;

},{"kitbuilder-behaviors/duplicate":1,"kitbuilder-behaviors/handle-duplicate":2,"kitbuilder-behaviors/resizable":4,"kitbuilder-behaviors/sortable":5,"kitbuilder-views/base-element":68,"kitbuilder-views/element-empty":98}],71:[function(require,module,exports){
var ControlsStack;

ControlsStack = Marionette.CompositeView.extend( {
	className: 'kitbuilder-panel-controls-stack',

	templateHelpers: function() {
		return {
			elementData: kitbuilder.getElementData( this.model )
		};
	},

	ui: function() {
		return {
			tabs: '.kitbuilder-panel-navigation-tab',
			reloadButton: '.kitbuilder-update-preview-button'
		};
	},

	events: function() {
		return {
			'click @ui.tabs': 'onClickTabControl',
			'click @ui.reloadButton': 'onReloadButtonClick'
		};
	},

	modelEvents: {
		'destroy': 'onModelDestroy'
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'kitbuilder-behaviors/inner-tabs' )
		}
	},

	activeTab: null,

	activeSection: null,

	initialize: function() {
		this.listenTo( kitbuilder.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	filter: function( model ) {
		if ( model.get( 'tab' ) !== this.activeTab ) {
			return false;
		}

		if ( 'section' === model.get( 'type' ) ) {
			return true;
		}

		var section = model.get( 'section' );

		return ! section || section === this.activeSection;
	},

	activateTab: function( $tab ) {
		var activeTab = this.activeTab = $tab.data( 'tab' );

		this.ui.tabs.removeClass( 'active' );

		$tab.addClass( 'active' );

		var sectionControls = this.collection.filter( function( model ) {
			return 'section' === model.get( 'type' ) && activeTab === model.get( 'tab' );
		} );

		if ( sectionControls[0] ) {
			this.activateSection( sectionControls[0].get( 'name' ) );
		}
	},

	activateSection: function( sectionName ) {
		this.activeSection = sectionName;
	},

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return kitbuilder.getControlView( controlType );
	},

	openActiveSection: function() {
		var activeSection = this.activeSection,
			activeSectionView = this.children.filter( function( view ) {
				return activeSection === view.model.get( 'name' );
			} );

		if ( activeSectionView[0] ) {
			activeSectionView[0].ui.heading.addClass( 'kitbuilder-open' );
		}
	},

	onRenderCollection: function() {
		// Create tooltip on controls
		this.$( '.tooltip-target' ).tipsy( {
			gravity: function() {
				// `n` for down, `s` for up
				var gravity = Backbone.$( this ).data( 'tooltip-pos' );

				if ( undefined !== gravity ) {
					return gravity;
				} else {
					return 'n';
				}
			},
			title: function() {
				return this.getAttribute( 'data-tooltip' );
			}
		} );

		this.openActiveSection();
	},

	onRenderTemplate: function() {
		this.activateTab( this.ui.tabs.eq( 0 ) );
	},

	onModelDestroy: function() {
		this.destroy();
	},

	onClickTabControl: function( event ) {
		event.preventDefault();

		var $tab = this.$( event.currentTarget );

		if ( this.activeTab === $tab.data( 'tab' ) ) {
			return;
		}

		this.activateTab( $tab );

		this._renderChildren();
	},

	onReloadButtonClick: function() {
		kitbuilder.reloadPreview();
	},

	onDeviceModeChange: function() {
		this.$el.removeClass( 'kitbuilder-responsive-switchers-open' );
	},

	onChildviewControlSectionClicked: function( childView ) {
		var isSectionOpen = childView.ui.heading.hasClass( 'kitbuilder-open' );

		this.activateSection( isSectionOpen ? null : childView.model.get( 'name' ) );

		this._renderChildren();
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			this.$el.toggleClass( 'kitbuilder-responsive-switchers-open' );
		}
	}
} );

module.exports = ControlsStack;

},{"kitbuilder-behaviors/inner-tabs":3}],72:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlBaseMultipleItemView;

ControlBaseMultipleItemView = ControlBaseItemView.extend( {

	applySavedValue: function() {
		var values = this.getControlValue(),
			$inputs = this.$( '[data-setting]' ),
			self = this;

		_.each( values, function( value, key ) {
			var $input = $inputs.filter( function() {
				return key === this.dataset.setting;
			} );

			self.setInputValue( $input, value );
		} );
	},

	getControlValue: function( key ) {
		var values = this.elementSettingsModel.get( this.model.get( 'name' ) );

		if ( ! Backbone.$.isPlainObject( values ) ) {
			return {};
		}

		if ( key ) {
			return values[ key ] || '';
		}

		return kitbuilder.helpers.cloneObject( values );
	},

	setValue: function( key, value ) {
		var values = this.getControlValue();

		if ( 'object' === typeof key ) {
			_.each( key, function( internalValue, internalKey ) {
				values[ internalKey ] = internalValue;
			} );
		} else {
			values[ key ] = value;
		}

		this.setSettingsModel( values );
	},

	updateElementModel: function( event ) {
		var inputValue = this.getInputValue( event.currentTarget ),
			key = event.currentTarget.dataset.setting;

		this.setValue( key, inputValue );
	}
}, {
	// Static methods
	getStyleValue: function( placeholder, controlValue ) {
		if ( ! _.isObject( controlValue ) ) {
			return ''; // invalid
		}

		return controlValue[ placeholder ];
	}
} );

module.exports = ControlBaseMultipleItemView;

},{"kitbuilder-views/controls/base":74}],73:[function(require,module,exports){
var ControlBaseMultipleItemView = require( 'kitbuilder-views/controls/base-multiple' ),
	ControlBaseUnitsItemView;

ControlBaseUnitsItemView = ControlBaseMultipleItemView.extend( {

	getCurrentRange: function() {
		return this.getUnitRange( this.getControlValue( 'unit' ) );
	},

	getUnitRange: function( unit ) {
		var ranges = this.model.get( 'range' );

		if ( ! ranges || ! ranges[ unit ] ) {
			return false;
		}

		return ranges[ unit ];
	}
} );

module.exports = ControlBaseUnitsItemView;

},{"kitbuilder-views/controls/base-multiple":72}],74:[function(require,module,exports){
var ControlBaseItemView;

ControlBaseItemView = Marionette.CompositeView.extend( {
	ui: function() {
		return {
			input: 'input[data-setting][type!="checkbox"][type!="radio"]',
			checkbox: 'input[data-setting][type="checkbox"]',
			radio: 'input[data-setting][type="radio"]',
			select: 'select[data-setting]',
			textarea: 'textarea[data-setting]',
			controlTitle: '.kitbuilder-control-title',
			responsiveSwitchers: '.kitbuilder-responsive-switcher'
		};
	},

	className: function() {
		// TODO: Any better classes for that?
		var classes = 'kitbuilder-control kitbuilder-control-' + this.model.get( 'name' ) + ' kitbuilder-control-type-' + this.model.get( 'type' ),
			modelClasses = this.model.get( 'classes' ),
			responsive = this.model.get( 'responsive' );

		if ( ! _.isEmpty( modelClasses ) ) {
			classes += ' ' + modelClasses;
		}

		if ( ! _.isEmpty( this.model.get( 'section' ) ) ) {
			classes += ' kitbuilder-control-under-section';
		}

		if ( ! _.isEmpty( responsive ) ) {
			_.each( responsive, function( device ) {
				classes += ' kitbuilder-control-responsive-' + device;
			} );
		}

		return classes;
	},

	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-kitbuilder-control-' + this.model.get( 'type' ) + '-content' );
	},

	templateHelpers: function() {
		var controlData = {
			controlValue: this.getControlValue(),
			_cid: this.model.cid
		};

		return {
			data: _.extend( {}, this.model.toJSON(), controlData )
		};
	},

	baseEvents: {
		'input @ui.input': 'onBaseInputChange',
		'change @ui.checkbox': 'onBaseInputChange',
		'change @ui.radio': 'onBaseInputChange',
		'input @ui.textarea': 'onBaseInputChange',
		'change @ui.select': 'onBaseInputChange',
		'click @ui.responsiveSwitchers': 'onSwitcherClick'
	},

	childEvents: {},

	events: function() {
		return _.extend( {}, this.baseEvents, this.childEvents );
	},

	initialize: function( options ) {
		this.elementSettingsModel = options.elementSettingsModel;

		var controlType = this.model.get( 'type' ),
			controlSettings = Backbone.$.extend( true, {}, kitbuilder.config.controls[ controlType ], this.model.attributes );

		this.model.set( controlSettings );

		this.listenTo( this.elementSettingsModel, 'change', this.toggleControlVisibility );
	},

	getControlValue: function() {
		return this.elementSettingsModel.get( this.model.get( 'name' ) );
	},

	isValidValue: function( value ) {
		return true;
	},

	setValue: function( value ) {
		this.setSettingsModel( value );
	},

	setSettingsModel: function( value ) {
		if ( true !== this.isValidValue( value ) ) {
			this.triggerMethod( 'settings:error' );
			return;
		}

		this.elementSettingsModel.set( this.model.get( 'name' ), value );

		this.triggerMethod( 'settings:change' );

		var elementType = this.elementSettingsModel.get( 'elType' );

		// TODO: The following is a temp fallback from 1.2.0
		if ( 'widget' === elementType ) {
			elementType = this.elementSettingsModel.get( 'widgetType' );
		}

		if ( undefined === elementType ) {
			return;
		}

		// Do not use with this action
		// It's here for tests and maybe later will be publish
		kitbuilder.hooks.doAction( 'panel/editor/element/' + elementType + '/' + this.model.get( 'name' ) + '/changed' );
	},

	applySavedValue: function() {
		this.setInputValue( '[data-setting="' + this.model.get( 'name' ) + '"]', this.getControlValue() );
	},

	getEditSettings: function( setting ) {
		var settings = this.getOption( 'elementEditSettings' ).toJSON();

		if ( setting ) {
			return settings[ setting ];
		}

		return settings;
	},

	setEditSetting: function( settingKey, settingValue ) {
		var settings = this.getOption( 'elementEditSettings' );

		settings.set( settingKey, settingValue );
	},

	getInputValue: function( input ) {
		var $input = this.$( input ),
			inputValue = $input.val(),
			inputType = $input.attr( 'type' );

		if ( -1 !== [ 'radio', 'checkbox' ].indexOf( inputType ) ) {
			return $input.prop( 'checked' ) ? inputValue : '';
		}

		// Temp fix for jQuery (< 3.0) that return null instead of empty array
		if ( 'SELECT' === input.tagName && $input.prop( 'multiple' ) && null === inputValue ) {
			inputValue = [];
		}

		return inputValue;
	},

	setInputValue: function( input, value ) {
		var $input = this.$( input ),
			inputType = $input.attr( 'type' );

		if ( 'checkbox' === inputType ) {
			$input.prop( 'checked', !! value );
		} else if ( 'radio' === inputType ) {
			$input.filter( '[value="' + value + '"]' ).prop( 'checked', true );
		} else {
			$input.val( value );
		}
	},

	onSettingsError: function() {
		this.$el.addClass( 'kitbuilder-error' );
	},

	onSettingsChange: function() {
		this.$el.removeClass( 'kitbuilder-error' );
	},

	onRender: function() {
		this.applySavedValue();

		var layoutType = this.model.get( 'label_block' ) ? 'block' : 'inline',
			showLabel = this.model.get( 'show_label' ),
			elClasses = 'kitbuilder-label-' + layoutType;

		elClasses += ' kitbuilder-control-separator-' + this.model.get( 'separator' );

		if ( ! showLabel ) {
			elClasses += ' kitbuilder-control-hidden-label';
		}

		this.$el.addClass( elClasses );
		this.renderResponsiveSwitchers();

		this.triggerMethod( 'ready' );
		this.toggleControlVisibility();
	},

	onBaseInputChange: function( event ) {
		this.updateElementModel( event );

		this.triggerMethod( 'input:change', event );
	},

	onSwitcherClick: function( event ) {
		var device = Backbone.$( event.currentTarget ).data( 'device' );

		kitbuilder.changeDeviceMode( device );

		this.triggerMethod( 'responsive:switcher:click', device );
	},

	renderResponsiveSwitchers: function() {
		if ( _.isEmpty( this.model.get( 'responsive' ) ) ) {
			return;
		}

		var templateHtml = Backbone.$( '#tmpl-kitbuilder-control-responsive-switchers' ).html();

		this.ui.controlTitle.after( templateHtml );
	},

	toggleControlVisibility: function() {
		var isVisible = kitbuilder.helpers.isActiveControl( this.model, this.elementSettingsModel.attributes );

		this.$el.toggleClass( 'kitbuilder-hidden-control', ! isVisible );

		kitbuilder.channels.data.trigger( 'scrollbar:update' );
	},

	onReady: function() {},

	updateElementModel: function( event ) {
		this.setValue( this.getInputValue( event.currentTarget ) );
	}
}, {
	// Static methods
	getStyleValue: function( placeholder, controlValue ) {
		return controlValue;
	}
} );

module.exports = ControlBaseItemView;

},{}],75:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'kitbuilder-views/controls/base-multiple' ),
	ControlBoxShadowItemView;

ControlBoxShadowItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.sliders = '.kitbuilder-slider';
		ui.colors = '.kitbuilder-box-shadow-color-picker';

		return ui;
	},

	childEvents: {
		'slide @ui.sliders': 'onSlideChange'
	},

	initSliders: function() {
		var value = this.getControlValue();

		this.ui.sliders.each( function() {
			var $slider = Backbone.$( this ),
				$input = $slider.next( '.kitbuilder-slider-input' ).find( 'input' );

			$slider.slider( {
				value: value[ this.dataset.input ],
				min: +$input.attr( 'min' ),
				max: +$input.attr( 'max' )
			} );
		} );
	},

	initColors: function() {
		var self = this;

		kitbuilder.helpers.wpColorPicker( this.ui.colors, {
			change: function() {
				var $this = Backbone.$( this ),
					type = $this.data( 'setting' );

				self.setValue( type, $this.wpColorPicker( 'color' ) );
			},

			clear: function() {
				self.setValue( this.dataset.setting, '' );
			}
		} );
	},

	onInputChange: function( event ) {
		var type = event.currentTarget.dataset.setting,
			$slider = this.ui.sliders.filter( '[data-input="' + type + '"]' );

		$slider.slider( 'value', this.getControlValue( type ) );
	},

	onReady: function() {
		this.initSliders();
		this.initColors();
	},

	onSlideChange: function( event, ui ) {
		var type = event.currentTarget.dataset.input,
			$input = this.ui.input.filter( '[data-setting="' + type + '"]' );

		$input.val( ui.value );
		this.setValue( type, ui.value );
	},

	onBeforeDestroy: function() {
		this.ui.colors.each( function() {
			var $color = Backbone.$( this );

			if ( $color.wpColorPicker( 'instance' ) ) {
				$color.wpColorPicker( 'close' );
			}
		} );

		this.$el.remove();
	}
} );

module.exports = ControlBoxShadowItemView;

},{"kitbuilder-views/controls/base-multiple":72}],76:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlChooseItemView;

ControlChooseItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.inputs = '[type="radio"]';

		return ui;
	},

	childEvents: {
		'mousedown label': 'onMouseDownLabel',
		'click @ui.inputs': 'onClickInput',
		'change @ui.inputs': 'updateElementModel'
	},

	onMouseDownLabel: function( event ) {
		var $clickedLabel = this.$( event.currentTarget ),
			$selectedInput = this.$( '#' + $clickedLabel.attr( 'for' ) );

		$selectedInput.data( 'checked', $selectedInput.prop( 'checked' ) );
	},

	onClickInput: function( event ) {
		if ( ! this.model.get( 'toggle' ) ) {
			return;
		}

		var $selectedInput = this.$( event.currentTarget );

		if ( $selectedInput.data( 'checked' ) ) {
			$selectedInput.prop( 'checked', false ).trigger( 'change' );
		}
	},

	onRender: function() {
		ControlBaseItemView.prototype.onRender.apply( this, arguments );

		var currentValue = this.getControlValue();

		if ( currentValue ) {
			this.ui.inputs.filter( '[value="' + currentValue + '"]' ).prop( 'checked', true );
		} else if ( ! this.model.get( 'toggle' ) ) {
			this.ui.inputs.first().prop( 'checked', true ).trigger( 'change' );
		}
	}
} );

module.exports = ControlChooseItemView;

},{"kitbuilder-views/controls/base":74}],77:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlCodeEditorItemView;

ControlCodeEditorItemView = ControlBaseItemView.extend( {

	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.editor = '.kitbuilder-code-editor';

		return ui;
	},

	onReady: function() {
		var self = this;

		if ( 'undefined' === typeof ace ) {
			return;
		}

		self.editor = ace.edit( this.ui.editor[0] );

		Backbone.$( self.editor.container ).addClass( 'kitbuilder-input-style kitbuilder-code-editor' );

		self.editor.setOptions( {
			mode: 'ace/mode/' + self.model.attributes.language,
			minLines: 10,
			maxLines: Infinity,
			showGutter: true,
			useWorker: true
		} );

		self.editor.setValue( self.getControlValue(), -1 ); // -1 =  move cursor to the start

		self.editor.on( 'change', function() {
			self.setValue( self.editor.getValue() );
		} );

		if ( 'html' === self.model.attributes.language ) {
			// Remove the `doctype` annotation
			var session = self.editor.getSession();

			session.on( 'changeAnnotation', function() {
				var annotations = session.getAnnotations() || [],
					annotationsLength = annotations.length,
					index = annotations.length;

				while ( index-- ) {
					if ( /doctype first\. Expected/.test( annotations[ index ].text ) ) {
						annotations.splice( index, 1 );
					}
				}

				if ( annotationsLength > annotations.length ) {
					session.setAnnotations( annotations );
				}
			}) ;
		}
	}
} );

module.exports = ControlCodeEditorItemView;

},{"kitbuilder-views/controls/base":74}],78:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlColorItemView;

ControlColorItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.picker = '.color-picker-hex';

		return ui;
	},

	onReady: function() {
		kitbuilder.helpers.wpColorPicker( this.ui.picker, {
            width: 250,
			change: _.bind( function() {
				this.setValue( this.ui.picker.wpColorPicker( 'color' ) );
			}, this ),

			clear: _.bind( function() {
				this.setValue( '' );
			}, this )
		} ).wpColorPicker( 'instance' )
			.wrap.find( '> .wp-picker-input-wrap > .wp-color-picker' )
			.removeAttr( 'maxlength' );
	},

	onBeforeDestroy: function() {
		if ( this.ui.picker.wpColorPicker( 'instance' ) ) {
			this.ui.picker.wpColorPicker( 'close' );
		}
		this.$el.remove();
	}
} );

module.exports = ControlColorItemView;

},{"kitbuilder-views/controls/base":74}],79:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlDateTimePickerItemView;

ControlDateTimePickerItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.picker = '.kitbuilder-date-time-picker';

		return ui;
	},

	onReady: function() {
		var self = this;

		var options = _.extend( this.model.get( 'picker_options' ), {
			onHide: function() {
				self.saveValue();
			}
		} );

		this.ui.picker.appendDtpicker( options ).handleDtpicker( 'setDate', new Date( this.getControlValue() ) );
	},

	saveValue: function() {
		this.setValue( this.ui.input.val() );
	},

	onBeforeDestroy: function() {
		this.saveValue();
		this.ui.picker.dtpicker( 'destroy' );
	}
} );

module.exports = ControlDateTimePickerItemView;

},{"kitbuilder-views/controls/base":74}],80:[function(require,module,exports){
var ControlBaseUnitsItemView = require( 'kitbuilder-views/controls/base-units' ),
	ControlDimensionsItemView;

ControlDimensionsItemView = ControlBaseUnitsItemView.extend( {
	ui: function() {
		var ui = ControlBaseUnitsItemView.prototype.ui.apply( this, arguments );

		ui.controls = '.kitbuilder-control-dimension > input:enabled';
		ui.link = 'button.kitbuilder-link-dimensions';

		return ui;
	},

	childEvents: {
		'click @ui.link': 'onLinkDimensionsClicked'
	},

	defaultDimensionValue: 0,

	initialize: function() {
		ControlBaseUnitsItemView.prototype.initialize.apply( this, arguments );

		// TODO: Need to be in helpers, and not in variable
		this.model.set( 'allowed_dimensions', this.filterDimensions( this.model.get( 'allowed_dimensions' ) ) );
	},

	getPossibleDimensions: function() {
		return [
			'top',
			'right',
			'bottom',
			'left'
		];
	},

	filterDimensions: function( filter ) {
		filter = filter || 'all';

		var dimensions = this.getPossibleDimensions();

		if ( 'all' === filter ) {
			return dimensions;
		}

		if ( ! _.isArray( filter ) ) {
			if ( 'horizontal' === filter ) {
				filter = [ 'right', 'left' ];
			} else if ( 'vertical' === filter ) {
				filter = [ 'top', 'bottom' ];
			}
		}

		return filter;
	},

	onReady: function() {
		var currentValue = this.getControlValue();

		if ( ! this.isLinkedDimensions() ) {
			this.ui.link.addClass( 'unlinked' );

			this.ui.controls.each( _.bind( function( index, element ) {
				var value = currentValue[ element.dataset.setting ];

				if ( _.isEmpty( value ) ) {
					value = this.defaultDimensionValue;
				}

				this.$( element ).val( value );
			}, this ) );
		}

		this.fillEmptyDimensions();
	},

	updateDimensionsValue: function() {
		var currentValue = {},
			dimensions = this.getPossibleDimensions(),
			$controls = this.ui.controls;

		dimensions.forEach( _.bind( function( dimension ) {
			var $element = $controls.filter( '[data-setting="' + dimension + '"]' );

			currentValue[ dimension ] = $element.length ? $element.val() : this.defaultDimensionValue;
		}, this ) );

		this.setValue( currentValue );
	},

	fillEmptyDimensions: function() {
		var dimensions = this.getPossibleDimensions(),
			allowedDimensions = this.model.get( 'allowed_dimensions' ),
			$controls = this.ui.controls;

		if ( this.isLinkedDimensions() ) {
			return;
		}

		dimensions.forEach( _.bind( function( dimension ) {
			var $element = $controls.filter( '[data-setting="' + dimension + '"]' ),
				isAllowedDimension = -1 !== _.indexOf( allowedDimensions, dimension );

			if ( isAllowedDimension && $element.length && _.isEmpty( $element.val() ) ) {
				$element.val( this.defaultDimensionValue );
			}

		}, this ) );
	},

	updateDimensions: function() {
		this.fillEmptyDimensions();
		this.updateDimensionsValue();
	},

	resetDimensions: function() {
		this.ui.controls.val( '' );

		this.updateDimensionsValue();
	},

	onInputChange: function( event ) {
		var inputSetting = event.target.dataset.setting;

		if ( 'unit' === inputSetting ) {
			this.resetDimensions();
		}

		if ( ! _.contains( this.getPossibleDimensions(), inputSetting ) ) {
			return;
		}

		if ( this.isLinkedDimensions() ) {
			var $thisControl = this.$( event.target );

			this.ui.controls.val( $thisControl.val() );
		}

		this.updateDimensions();
	},

	onLinkDimensionsClicked: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.ui.link.toggleClass( 'unlinked' );

		this.setValue( 'isLinked', ! this.ui.link.hasClass( 'unlinked' ) );

		if ( this.isLinkedDimensions() ) {
			// Set all controls value from the first control.
			this.ui.controls.val( this.ui.controls.eq( 0 ).val() );
		}

		this.updateDimensions();
	},

	isLinkedDimensions: function() {
		return this.getControlValue( 'isLinked' );
	}
} );

module.exports = ControlDimensionsItemView;

},{"kitbuilder-views/controls/base-units":73}],81:[function(require,module,exports){
var ControlSelect2View = require( 'kitbuilder-views/controls/select2' );

module.exports = ControlSelect2View.extend( {
	getSelect2Options: function() {
		return {
			dir: kitbuilder.config.is_rtl ? 'rtl' : 'ltr'
		};
	},

	templateHelpers: function() {
		var helpers = ControlSelect2View.prototype.templateHelpers.apply( this, arguments );

		helpers.getFontsByGroups = _.bind( function( groups ) {
			var fonts = this.model.get( 'fonts' ),
				filteredFonts = {};

			_.each( fonts, function( fontType, fontName ) {
				if ( _.isArray( groups ) && _.contains( groups, fontType ) || fontType === groups ) {
					filteredFonts[ fontName ] = fontType;
				}
			} );

			return filteredFonts;
		}, this );

		return helpers;
	}
} );

},{"kitbuilder-views/controls/select2":90}],82:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlMediaItemView;

ControlMediaItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.addImages = '.kitbuilder-control-gallery-add';
		ui.clearGallery = '.kitbuilder-control-gallery-clear';
		ui.galleryThumbnails = '.kitbuilder-control-gallery-thumbnails';

		return ui;
	},

	childEvents: {
		'click @ui.addImages': 'onAddImagesClick',
		'click @ui.clearGallery': 'onClearGalleryClick',
		'click @ui.galleryThumbnails': 'onGalleryThumbnailsClick'
	},

	onReady: function() {
		var hasImages = this.hasImages();

		this.$el
		    .toggleClass( 'kitbuilder-gallery-has-images', hasImages )
		    .toggleClass( 'kitbuilder-gallery-empty', ! hasImages );

		this.initRemoveDialog();
	},

	hasImages: function() {
		return !! this.getControlValue().length;
	},

	openFrame: function( action ) {
		this.initFrame( action );

		this.frame.open();
	},

	initFrame: function( action ) {
		var frameStates = {
			create: 'gallery',
			add: 'gallery-library',
			edit: 'gallery-edit'
		};

		var options = {
			frame:  'post',
			multiple: true,
			state: frameStates[ action ],
			button: {
				text: kitbuilder.translate( 'insert_media' )
			}
		};

		if ( this.hasImages() ) {
			options.selection = this.fetchSelection();
		}

		this.frame = wp.media( options );

		// When a file is selected, run a callback.
		this.frame.on( {
			'update': this.select,
			'menu:render:default': this.menuRender,
			'content:render:browse': this.gallerySettings
		}, this );
	},

	menuRender: function( view ) {
		view.unset( 'insert' );
		view.unset( 'featured-image' );
	},

	gallerySettings: function( browser ) {
		browser.sidebar.on( 'ready', function() {
			browser.sidebar.unset( 'gallery' );
		} );
	},

	fetchSelection: function() {
		var attachments = wp.media.query( {
			orderby: 'post__in',
			order: 'ASC',
			type: 'image',
			perPage: -1,
			post__in: _.pluck( this.getControlValue(), 'id' )
		} );

		return new wp.media.model.Selection( attachments.models, {
			props: attachments.props.toJSON(),
			multiple: true
		} );
	},

	/**
	 * Callback handler for when an attachment is selected in the media modal.
	 * Gets the selected image information, and sets it within the control.
	 */
	select: function( selection ) {
		var images = [];

		selection.each( function( image ) {
			images.push( {
				id: image.get( 'id' ),
				url: image.get( 'url' )
			} );
		} );

		this.setValue( images );

		this.render();
	},

	onBeforeDestroy: function() {
		if ( this.frame ) {
			this.frame.off();
		}

		this.$el.remove();
	},

	resetGallery: function() {
		this.setValue( '' );

		this.render();
	},

	initRemoveDialog: function() {
		var removeDialog;

		this.getRemoveDialog = function() {
			if ( ! removeDialog ) {
				removeDialog = kitbuilder.dialogsManager.createWidget( 'confirm', {
					message: kitbuilder.translate( 'dialog_confirm_gallery_delete' ),
					headerMessage: kitbuilder.translate( 'delete_gallery' ),
					strings: {
						confirm: kitbuilder.translate( 'delete' ),
						cancel: kitbuilder.translate( 'cancel' )
					},
					defaultOption: 'confirm',
					onConfirm: _.bind( this.resetGallery, this )
				} );
			}

			return removeDialog;
		};
	},

	onAddImagesClick: function() {
		this.openFrame( this.hasImages() ? 'add' : 'create' );
	},

	onClearGalleryClick: function() {
		this.getRemoveDialog().show();
	},

	onGalleryThumbnailsClick: function() {
		this.openFrame( 'edit' );
	}
} );

module.exports = ControlMediaItemView;

},{"kitbuilder-views/controls/base":74}],83:[function(require,module,exports){
var ControlSelect2View = require( 'kitbuilder-views/controls/select2' ),
	ControlIconView;

ControlIconView = ControlSelect2View.extend( {

	initialize: function() {
		ControlSelect2View.prototype.initialize.apply( this, arguments );

		this.filterIcons();
	},

	filterIcons: function() {
		var icons = this.model.get( 'icons' ),
			include = this.model.get( 'include' ),
			exclude = this.model.get( 'exclude' );

		if ( include ) {
			var filteredIcons = {};

			_.each( include, function( iconKey ) {
				filteredIcons[ iconKey ] = icons[ iconKey ];
			} );

			this.model.set( 'icons', filteredIcons );
			return;
		}

		if ( exclude ) {
			_.each( exclude, function( iconKey ) {
				delete icons[ iconKey ];
			} );
		}
	},

	iconsList: function( icon ) {
		if ( ! icon.id ) {
			return icon.text;
		}

		return Backbone.$(
			'<span><i class="' + icon.id + '"></i> ' + icon.text + '</span>'
		);
	},

	getSelect2Options: function() {
		return {
			allowClear: true,
			templateResult: _.bind( this.iconsList, this ),
			templateSelection: _.bind( this.iconsList, this )
		};
	}
} );

module.exports = ControlIconView;

},{"kitbuilder-views/controls/select2":90}],84:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'kitbuilder-views/controls/base-multiple' ),
	ControlImageDimensionsItemView;

ControlImageDimensionsItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		return {
			inputWidth: 'input[data-setting="width"]',
			inputHeight: 'input[data-setting="height"]',

			btnApply: 'button.kitbuilder-image-dimensions-apply-button'
		};
	},

	// Override the base events
	baseEvents: {
		'click @ui.btnApply': 'onApplyClicked'
	},

	onApplyClicked: function( event ) {
		event.preventDefault();

		this.setValue( {
			width: this.ui.inputWidth.val(),
			height: this.ui.inputHeight.val()
		} );
	}
} );

module.exports = ControlImageDimensionsItemView;

},{"kitbuilder-views/controls/base-multiple":72}],85:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'kitbuilder-views/controls/base-multiple' ),
	ControlMediaItemView;

ControlMediaItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.controlMedia = '.kitbuilder-control-media';
		ui.frameOpeners = '.kitbuilder-control-media-upload-button, .kitbuilder-control-media-image';
		ui.deleteButton = '.kitbuilder-control-media-delete';

		return ui;
	},

	childEvents: {
		'click @ui.frameOpeners': 'openFrame',
		'click @ui.deleteButton': 'deleteImage'
	},

	onReady: function() {
		if ( _.isEmpty( this.getControlValue( 'url' ) ) ) {
			this.ui.controlMedia.addClass( 'media-empty' );
		}
	},

	openFrame: function() {
		if ( ! this.frame ) {
			this.initFrame();
		}

		this.frame.open();
	},

	deleteImage: function() {
		this.setValue( {
			url: '',
			id: ''
		} );

		this.render();
	},

	/**
	 * Create a media modal select frame, and store it so the instance can be reused when needed.
	 */
	initFrame: function() {
		this.frame = wp.media( {
			button: {
				text: kitbuilder.translate( 'insert_media' )
			},
			states: [
				new wp.media.controller.Library( {
					title: kitbuilder.translate( 'insert_media' ),
					library: wp.media.query( { type: 'image' } ),
					multiple: false,
					date: false
				} )
			]
		} );

		// When a file is selected, run a callback.
		this.frame.on( 'insert select', _.bind( this.select, this ) );
	},

	/**
	 * Callback handler for when an attachment is selected in the media modal.
	 * Gets the selected image information, and sets it within the control.
	 */
	select: function() {
		// Get the attachment from the modal frame.
		var attachment = this.frame.state().get( 'selection' ).first().toJSON();

		if ( attachment.url ) {
			this.setValue( {
				url: attachment.url,
				id: attachment.id
			} );

			this.render();
		}
	},

	onBeforeDestroy: function() {
		this.$el.remove();
	}
} );

module.exports = ControlMediaItemView;

},{"kitbuilder-views/controls/base-multiple":72}],86:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'kitbuilder-views/controls/base-multiple' ),
	ControlOrderItemView;

ControlOrderItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.reverseOrderLabel = '.kitbuilder-control-order-label';

		return ui;
	},

	changeLabelTitle: function() {
		var reverseOrder = this.getControlValue( 'reverse_order' );

		this.ui.reverseOrderLabel.attr( 'title', kitbuilder.translate( reverseOrder ? 'asc' : 'desc' ) );
	},

	onRender: function() {
		ControlMultipleBaseItemView.prototype.onRender.apply( this, arguments );

		this.changeLabelTitle();
	},

	onInputChange: function() {
		this.changeLabelTitle();
	}
} );

module.exports = ControlOrderItemView;

},{"kitbuilder-views/controls/base-multiple":72}],87:[function(require,module,exports){
var RepeaterRowView;

RepeaterRowView = Marionette.CompositeView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-kitbuilder-repeater-row' ),

	className: 'repeater-fields',

	ui: {
		duplicateButton: '.kitbuilder-repeater-tool-duplicate',
		editButton: '.kitbuilder-repeater-tool-edit',
		removeButton: '.kitbuilder-repeater-tool-remove',
		itemTitle: '.kitbuilder-repeater-row-item-title'
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'kitbuilder-behaviors/inner-tabs' )
		}
	},

	triggers: {
		'click @ui.removeButton': 'click:remove',
		'click @ui.duplicateButton': 'click:duplicate',
		'click @ui.itemTitle': 'click:edit'
	},

	templateHelpers: function() {
		return {
			itemIndex: this.getOption( 'itemIndex' )
		};
	},

	childViewContainer: '.kitbuilder-repeater-row-controls',

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return kitbuilder.getControlView( controlType );
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	checkConditions: function() {
		var self = this;

		self.collection.each( function( model ) {
			var conditions = model.get( 'conditions' ),
				parentConditions = model.get( 'parent_conditions' ),
				isVisible = true;

			if ( conditions ) {
				isVisible = kitbuilder.conditions.check( conditions, self.model.attributes );
			}

			if ( parentConditions ) {
				isVisible = kitbuilder.conditions.check( parentConditions, self.getOption( 'parentModel' ).attributes );
			}

			var child = self.children.findByModelCid( model.cid );

			child.$el.toggleClass( 'kitbuilder-panel-hide', ! isVisible );
		} );
	},

	updateIndex: function( newIndex ) {
		this.itemIndex = newIndex;
		this.setTitle();
	},

	setTitle: function() {
		var self = this,
			titleField = self.getOption( 'titleField' ),
			title = '';

		if ( titleField ) {
			var values = {};

			self.children.each( function( child ) {
				values[ child.model.get( 'name' ) ] = child.getControlValue();
			} );

			title = Marionette.TemplateCache.prototype.compileTemplate( titleField )( values );
		}

		if ( ! title ) {
			title = kitbuilder.translate( 'Item #{0}', [ self.getOption( 'itemIndex' ) ] );
		}

		self.ui.itemTitle.html( title );
	},

	initialize: function( options ) {
		var self = this;

		self.elementSettingsModel = options.elementSettingsModel;

		self.itemIndex = 0;

		// Collection for Controls list
		self.collection = new Backbone.Collection( options.controlFields );

		self.listenTo( self.model, 'change', self.checkConditions );
		self.listenTo( self.getOption( 'parentModel' ), 'change', self.checkConditions );

		if ( options.titleField ) {
			self.listenTo( self.model, 'change', self.setTitle );
		}
	},

	onRender: function() {
		this.setTitle();
		this.checkConditions();
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			kitbuilder.getPanelView().getCurrentPageView().$el.toggleClass( 'kitbuilder-responsive-switchers-open' );
		}
	}
} );

module.exports = RepeaterRowView;

},{"kitbuilder-behaviors/inner-tabs":3}],88:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	RepeaterRowView = require( 'kitbuilder-views/controls/repeater-row' ),
	ControlRepeaterItemView;

ControlRepeaterItemView = ControlBaseItemView.extend( {
	ui: {
		btnAddRow: '.kitbuilder-repeater-add',
		fieldContainer: '.kitbuilder-repeater-fields'
	},

	events: {
		'click @ui.btnAddRow': 'onButtonAddRowClick',
		'sortstart @ui.fieldContainer': 'onSortStart',
		'sortupdate @ui.fieldContainer': 'onSortUpdate',
		'sortstop @ui.fieldContainer': 'onSortStop'
	},

	childView: RepeaterRowView,

	childViewContainer: '.kitbuilder-repeater-fields',

	templateHelpers: function() {
		return {
			data: _.extend( {}, this.model.toJSON(), { controlValue: [] } )
		};
	},

	childViewOptions: function() {
		return {
			controlFields: this.model.get( 'fields' ),
			titleField: this.model.get( 'title_field' ),
			parentModel: this.elementSettingsModel // For parentConditions in repeaterRow
		};
	},

	initialize: function( options ) {
		ControlBaseItemView.prototype.initialize.apply( this, arguments );

		this.collection = this.elementSettingsModel.get( this.model.get( 'name' ) );

		this.listenTo( this.collection, 'change', this.onRowControlChange );
		this.listenTo( this.collection, 'add remove reset', this.onRowChange, this );
	},

	addRow: function( data, options ) {
		var id = kitbuilder.helpers.getUniqueID();

		if ( data instanceof Backbone.Model ) {
			data.set( '_id', id );
		} else {
			data._id = id;
		}

		return this.collection.add( data, options );
	},

	editRow: function( rowView ) {
		if ( this.currentEditableChild ) {
			var currentEditable = this.currentEditableChild.getChildViewContainer( this.currentEditableChild );
			currentEditable.removeClass( 'editable' );

			// If the repeater contains TinyMCE editors, fire the `hide` trigger to hide floated toolbars
			currentEditable.find( '.kitbuilder-wp-editor' ).each( function() {
				tinymce.get( this.id ).fire( 'hide' );
			} );
		}

		if ( this.currentEditableChild === rowView ) {
			delete this.currentEditableChild;
			return;
		}

		rowView.getChildViewContainer( rowView ).addClass( 'editable' );

		this.currentEditableChild = rowView;

		this.updateActiveRow();
	},

	toggleMinRowsClass: function() {
		if ( ! this.model.get( 'prevent_empty' ) ) {
			return;
		}

		this.$el.toggleClass( 'kitbuilder-repeater-has-minimum-rows', 1 >= this.collection.length );
	},

	updateActiveRow: function() {
		var activeItemIndex = 0;

		if ( this.currentEditableChild ) {
			activeItemIndex = this.currentEditableChild.itemIndex;
		}

		this.setEditSetting( 'activeItemIndex', activeItemIndex );
	},

	updateChildIndexes: function() {
		this.children.each( _.bind( function( view ) {
			view.updateIndex( this.collection.indexOf( view.model ) + 1 );
		}, this ) );
	},

	onRender: function() {
		ControlBaseItemView.prototype.onRender.apply( this, arguments );

		this.ui.fieldContainer.sortable( { axis: 'y', handle: '.kitbuilder-repeater-row-tools' } );

		this.toggleMinRowsClass();
	},

	onSortStart: function( event, ui ) {
		ui.item.data( 'oldIndex', ui.item.index() );
	},

	onSortStop: function( event, ui ) {
		// Reload TinyMCE editors (if exist), it's a bug that TinyMCE content is missing after stop dragging
		ui.item.find( '.kitbuilder-wp-editor' ).each( function() {
			var editor = tinymce.get( this.id ),
				settings = editor.settings;

			settings.height = Backbone.$( editor.getContainer() ).height();
			tinymce.execCommand( 'mceRemoveEditor', true, this.id );
			tinymce.init( settings );
		} );
	},

	onSortUpdate: function( event, ui ) {
		var oldIndex = ui.item.data( 'oldIndex' ),
			model = this.collection.at( oldIndex ),
			newIndex = ui.item.index();

		this.collection.remove( model );

		this.addRow( model, { at: newIndex } );
	},

	onAddChild: function() {
		this.updateChildIndexes();
		this.updateActiveRow();
	},

	onRemoveChild: function( childView ) {
		if ( childView === this.currentEditableChild ) {
			delete this.currentEditableChild;
		}

		this.updateChildIndexes();
		this.updateActiveRow();
	},

	onRowChange: function() {
		var model = this.elementSettingsModel;

		model.changed = {};

		model.trigger( 'change', model, model._pending );

		this.toggleMinRowsClass();
	},

	onRowControlChange: function( model ) {
		this.elementSettingsModel.trigger( 'change', model, model._pending );
	},

	onButtonAddRowClick: function() {
		var defaults = {};
		_.each( this.model.get( 'fields' ), function( field ) {
			defaults[ field.name ] = field['default'];
		} );

		var newModel = this.addRow( defaults ),
			newChildView = this.children.findByModel( newModel );

		this.editRow( newChildView );
	},

	onChildviewClickRemove: function( childView ) {
		childView.model.destroy();
	},

	onChildviewClickDuplicate: function( childView ) {
		this.addRow( childView.model.clone(), { at: childView.itemIndex } );
	},

	onChildviewClickEdit: function( childView ) {
		this.editRow( childView );
	}
} );

module.exports = ControlRepeaterItemView;

},{"kitbuilder-views/controls/base":74,"kitbuilder-views/controls/repeater-row":87}],89:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlSectionItemView;

ControlSectionItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.heading = '.kitbuilder-panel-heading';

		return ui;
	},

	triggers: {
		'click': 'control:section:clicked'
	}
} );

module.exports = ControlSectionItemView;

},{"kitbuilder-views/controls/base":74}],90:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlSelect2ItemView;

ControlSelect2ItemView = ControlBaseItemView.extend( {
	getSelect2Options: function() {
		var placeholder = this.ui.select.children( 'option:first[value=""]' ).text();

		return {
			allowClear: true,
			placeholder: placeholder
		};
	},

	onReady: function() {
		this.ui.select.select2( this.getSelect2Options() );
	},

	onBeforeDestroy: function() {
		if ( this.ui.select.data( 'select2' ) ) {
			this.ui.select.select2( 'destroy' );
		}

		this.$el.remove();
	}
} );

module.exports = ControlSelect2ItemView;

},{"kitbuilder-views/controls/base":74}],91:[function(require,module,exports){
var ControlBaseUnitsItemView = require( 'kitbuilder-views/controls/base-units' ),
	ControlSliderItemView;

ControlSliderItemView = ControlBaseUnitsItemView.extend( {
	ui: function() {
		var ui = ControlBaseUnitsItemView.prototype.ui.apply( this, arguments );

		ui.slider = '.kitbuilder-slider';

		return ui;
	},

	childEvents: {
		'slide @ui.slider': 'onSlideChange'
	},

	initSlider: function() {
		var size = this.getControlValue( 'size' ),
			unitRange = this.getCurrentRange();

		this.ui.input.attr( unitRange ).val( size );

		this.ui.slider.slider( _.extend( {}, unitRange, { value: size, range: "min" } ) );
	},

	resetSize: function() {
		this.setValue( 'size', '' );

		this.initSlider();
	},

	onReady: function() {
		this.initSlider();
	},

	onSlideChange: function( event, ui ) {
		this.setValue( 'size', ui.value );

		this.ui.input.val( ui.value );
	},

	onInputChange: function( event ) {
		var dataChanged = event.currentTarget.dataset.setting;

		if ( 'size' === dataChanged ) {
			this.ui.slider.slider( 'value', this.getControlValue( 'size' ) );
		} else if ( 'unit' === dataChanged ) {
			this.resetSize();
		}
	},

	onBeforeDestroy: function() {
		this.ui.slider.slider( 'destroy' );
		this.$el.remove();
	}
} );

module.exports = ControlSliderItemView;

},{"kitbuilder-views/controls/base-units":73}],92:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlStructureItemView;

ControlStructureItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.resetStructure = '.kitbuilder-control-structure-reset';

		return ui;
	},

	childEvents: {
		'click @ui.resetStructure': 'onResetStructureClick'
	},

	templateHelpers: function() {
		var helpers = ControlBaseItemView.prototype.templateHelpers.apply( this, arguments );

		helpers.getMorePresets = _.bind( this.getMorePresets, this );

		return helpers;
	},

	getCurrentEditedSection: function() {
		var editor = kitbuilder.getPanelView().getCurrentPageView();

		return editor.getOption( 'editedElementView' );
	},

	getMorePresets: function() {
		var parsedStructure = kitbuilder.presetsFactory.getParsedStructure( this.getControlValue() );

		return kitbuilder.presetsFactory.getPresets( parsedStructure.columnsCount );
	},

	onInputChange: function() {
		this.getCurrentEditedSection().redefineLayout();

		this.render();
	},

	onResetStructureClick: function() {
		this.getCurrentEditedSection().resetColumnsCustomSize();
	}
} );

module.exports = ControlStructureItemView;

},{"kitbuilder-views/controls/base":74}],93:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' );

module.exports = ControlBaseItemView.extend( {
	setInputValue: function( input, value ) {
		// Make sure is string value
		// TODO: Remove in v1.6
		value = '' + value;

		this.$( input ).prop( 'checked', this.model.get( 'return_value' ) === value );
	}
} );

},{"kitbuilder-views/controls/base":74}],94:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlTabItemView;

ControlTabItemView = ControlBaseItemView.extend( {
	triggers: {
		'click': 'control:tab:clicked'
	}
} );

module.exports = ControlTabItemView;

},{"kitbuilder-views/controls/base":74}],95:[function(require,module,exports){
var ControlMultipleBaseItemView = require( 'kitbuilder-views/controls/base-multiple' ),
	ControlUrlItemView;

ControlUrlItemView = ControlMultipleBaseItemView.extend( {
	ui: function() {
		var ui = ControlMultipleBaseItemView.prototype.ui.apply( this, arguments );

		ui.btnExternal = 'button.kitbuilder-control-url-target';

		return ui;
	},

	// Override the base events
	childEvents: {
		'click @ui.btnExternal': 'onExternalClicked'
	},

	onReady: function() {
		if ( this.getControlValue( 'is_external' ) ) {
			this.ui.btnExternal.addClass( 'active' );
		}
	},

	onExternalClicked: function( event ) {
		event.preventDefault();

		this.ui.btnExternal.toggleClass( 'active' );
		this.setValue( 'is_external', this.isExternal() );
	},

	isExternal: function() {
		return this.ui.btnExternal.hasClass( 'active' );
	}
} );

module.exports = ControlUrlItemView;

},{"kitbuilder-views/controls/base-multiple":72}],96:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlWPWidgetItemView;

ControlWPWidgetItemView = ControlBaseItemView.extend( {
	ui: function() {
		var ui = ControlBaseItemView.prototype.ui.apply( this, arguments );

		ui.form = 'form';
		ui.loading = '.wp-widget-form-loading';

		return ui;
	},

	events: {
		'keyup @ui.form :input': 'onFormChanged',
		'change @ui.form :input': 'onFormChanged'
	},

	onFormChanged: function() {
		var idBase = 'widget-' + this.model.get( 'id_base' ),
			settings = this.ui.form.kitbuilderSerializeObject()[ idBase ].REPLACE_TO_ID;

		this.setValue( settings );
	},

	onReady: function() {
		kitbuilder.ajax.send( 'editor_get_wp_widget_form', {
			data: {
				// Fake Widget ID
				id: this.model.cid,
				widget_type: this.model.get( 'widget' ),
				data: JSON.stringify( this.elementSettingsModel.toJSON() )
			},
			success: _.bind( function( data ) {
				this.ui.form.html( data );
			}, this )
		} );
	}
} );

module.exports = ControlWPWidgetItemView;

},{"kitbuilder-views/controls/base":74}],97:[function(require,module,exports){
var ControlBaseItemView = require( 'kitbuilder-views/controls/base' ),
	ControlWysiwygItemView;

ControlWysiwygItemView = ControlBaseItemView.extend( {
	childEvents: {
		'keyup textarea.kitbuilder-wp-editor': 'updateElementModel'
	},

	// List of buttons to move {buttonToMove: afterButton}
	buttons: {
		moveToAdvanced: {
			blockquote: 'removeformat',
			alignleft: 'blockquote',
			aligncenter: 'alignleft',
			alignright: 'aligncenter'
		},
		moveToBasic: {},
		removeFromBasic: [ 'unlink', 'wp_more' ],
		removeFromAdvanced: []
	},

	initialize: function() {
		ControlBaseItemView.prototype.initialize.apply( this, arguments );

		var self = this;

		self.editorID = 'kitbuilderwpeditor' + self.cid;

		// Wait a cycle before initializing the editors.
		_.defer( function() {
			// Initialize QuickTags, and set as the default mode.
			quicktags( {
				buttons: 'strong,em,del,link,img,close',
				id: self.editorID
			} );

			if ( kitbuilder.config.rich_editing_enabled ) {
				switchEditors.go( self.editorID, 'tmce' );
			}

			delete QTags.instances[ 0 ];
		} );

		if ( ! kitbuilder.config.rich_editing_enabled ) {
			self.$el.addClass( 'kitbuilder-rich-editing-disabled' );

			return;
		}

		var editorConfig = {
			id: self.editorID,
			selector: '#' + self.editorID,
			setup: function( editor ) {
				editor.on( 'keyup change undo redo SetContent', function() {
					editor.save();

					self.setValue( editor.getContent() );
				} );
			}
		};

		tinyMCEPreInit.mceInit[ self.editorID ] = _.extend( _.clone( tinyMCEPreInit.mceInit.kitbuilderwpeditor ), editorConfig );

		if ( ! kitbuilder.config.tinymceHasCustomConfig ) {
			self.rearrangeButtons();
		}
	},

	attachElContent: function() {
		var editorTemplate = kitbuilder.config.wp_editor.replace( /kitbuilderwpeditor/g, this.editorID ).replace( '%%EDITORCONTENT%%', this.getControlValue() );

		this.$el.html( editorTemplate );

		return this;
	},

	moveButtons: function( buttonsToMove, from, to ) {
		_.each( buttonsToMove, function( afterButton, button ) {
			var buttonIndex = from.indexOf( button ),
				afterButtonIndex = to.indexOf( afterButton );

			if ( -1 === buttonIndex ) {
				throw new ReferenceError( 'Trying to move non-existing button `' + button + '`' );
			}

			if ( -1 === afterButtonIndex ) {
				throw new ReferenceError( 'Trying to move button after non-existing button `' + afterButton + '`' );
			}

			from.splice( buttonIndex, 1 );

			to.splice( afterButtonIndex + 1, 0, button );
		} );
	},

	rearrangeButtons: function() {
		var editorProps = tinyMCEPreInit.mceInit[ this.editorID ],
			editorBasicToolbarButtons = editorProps.toolbar1.split( ',' ),
			editorAdvancedToolbarButtons = editorProps.toolbar2.split( ',' );

		editorBasicToolbarButtons = _.difference( editorBasicToolbarButtons, this.buttons.removeFromBasic );

		editorAdvancedToolbarButtons = _.difference( editorAdvancedToolbarButtons, this.buttons.removeFromAdvanced );

		this.moveButtons( this.buttons.moveToBasic, editorAdvancedToolbarButtons, editorBasicToolbarButtons );

		this.moveButtons( this.buttons.moveToAdvanced, editorBasicToolbarButtons, editorAdvancedToolbarButtons );

		editorProps.toolbar1 = editorBasicToolbarButtons.join( ',' );
		editorProps.toolbar2 = editorAdvancedToolbarButtons.join( ',' );
	},

	onBeforeDestroy: function() {
		// Remove TinyMCE and QuickTags instances
		delete QTags.instances[ this.editorID ];

		if ( ! kitbuilder.config.rich_editing_enabled ) {
			return;
		}

		tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, this.editorID );

		// Cleanup PreInit data
		delete tinyMCEPreInit.mceInit[ this.editorID ];
		delete tinyMCEPreInit.qtInit[ this.editorID ];
	}
} );

module.exports = ControlWysiwygItemView;

},{"kitbuilder-views/controls/base":74}],98:[function(require,module,exports){
var ElementEmptyView;

ElementEmptyView = Marionette.ItemView.extend( {
	template: '#tmpl-kitbuilder-empty-preview',

	className: 'kitbuilder-empty-view',

	events: {
		'click': 'onClickAdd'
	},

	onClickAdd: function() {
		kitbuilder.getPanelView().setPage( 'elements' );
	}
} );

module.exports = ElementEmptyView;

},{}],99:[function(require,module,exports){
var BaseSectionsContainerView = require( 'kitbuilder-views/base-sections-container' ),
	Preview;

Preview = BaseSectionsContainerView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-kitbuilder-preview' ),

	className: 'kitbuilder-inner',

	childViewContainer: '.kitbuilder-section-wrap',

	ui: {
		addSectionArea: '#kitbuilder-add-section',
		addNewSection: '#kitbuilder-add-new-section',
		closePresetsIcon: '#kitbuilder-select-preset-close',
		addSectionButton: '#kitbuilder-add-section-button',
		addTemplateButton: '#kitbuilder-add-template-button',
		selectPreset: '#kitbuilder-select-preset',
		presets: '.kitbuilder-preset'
	},

	events: {
		'click @ui.addSectionButton': 'onAddSectionButtonClick',
		'click @ui.addTemplateButton': 'onAddTemplateButtonClick',
		'click @ui.closePresetsIcon': 'closeSelectPresets',
		'click @ui.presets': 'onPresetSelected'
	},

	closeSelectPresets: function() {
		this.ui.addNewSection.show();
		this.ui.selectPreset.hide();
	},

	onAddSectionButtonClick: function() {
		this.ui.addNewSection.hide();
		this.ui.selectPreset.show();
	},

	onAddTemplateButtonClick: function() {
		kitbuilder.templates.startModal( function() {
			kitbuilder.templates.showTemplates();
		} );
	},

	onRender: function() {
		var self = this;

		self.ui.addSectionArea.html5Droppable( {
			axis: [ 'vertical' ],
			groups: [ 'kitbuilder-element' ],
			onDragEnter: function( side ) {
				self.ui.addSectionArea.attr( 'data-side', side );
			},
			onDragLeave: function() {
				self.ui.addSectionArea.removeAttr( 'data-side' );
			},
			onDropping: function() {
				self.addSection().addElementFromPanel();
			}
		} );
	},

	onPresetSelected: function( event ) {
		this.closeSelectPresets();

		var selectedStructure = event.currentTarget.dataset.structure,
			parsedStructure = kitbuilder.presetsFactory.getParsedStructure( selectedStructure ),
			elements = [],
			loopIndex;

		for ( loopIndex = 0; loopIndex < parsedStructure.columnsCount; loopIndex++ ) {
			elements.push( {
				id: kitbuilder.helpers.getUniqueID(),
				elType: 'column',
				settings: {},
				elements: []
			} );
		}

		var newSection = this.addSection( { elements: elements } );

		newSection.setStructure( selectedStructure );
		newSection.redefineLayout();
	}
} );

module.exports = Preview;

},{"kitbuilder-views/base-sections-container":69}],100:[function(require,module,exports){
var BaseElementView = require( 'kitbuilder-views/base-element' ),
	SectionView;

SectionView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-kitbuilder-element-section-content' ),

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' kitbuilder-section kitbuilder-' + type + '-section';
	},

	tagName: 'section',

	childViewContainer: '> .kitbuilder-container > .kitbuilder-row',

	behaviors: {
		Sortable: {
			behaviorClass: require( 'kitbuilder-behaviors/sortable' ),
			elChildType: 'column'
		},
		HandleDuplicate: {
			behaviorClass: require( 'kitbuilder-behaviors/handle-duplicate' )
		},
		HandleAddMode: {
			behaviorClass: require( 'kitbuilder-behaviors/duplicate' )
		}
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.duplicateButton = '.kitbuilder-editor-section-settings-list .kitbuilder-editor-element-duplicate';
		ui.removeButton = '.kitbuilder-editor-section-settings-list .kitbuilder-editor-element-remove';
		ui.saveButton = '.kitbuilder-editor-section-settings-list .kitbuilder-editor-element-save';
		ui.triggerButton = '.kitbuilder-editor-section-settings-list .kitbuilder-editor-element-trigger';
        ui.editButton = '.kitbuilder-editor-section-settings-list .kitbuilder-editor-element-edit-trigger';

		return ui;
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events[ 'click @ui.editButton' ] = 'onClickEdit';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.listenTo( this.collection, 'add remove reset', this._checkIsFull )
			.listenTo( this.model, 'change:settings:structure', this.onStructureChanged );
	},

	addEmptyColumn: function() {
		this.addChildModel( {
			id: kitbuilder.helpers.getUniqueID(),
			elType: 'column',
			settings: {},
			elements: []
		} );
	},

	addChildModel: function( model, options ) {
		var isModelInstance = model instanceof Backbone.Model,
			isInner = this.isInner();

		if ( isModelInstance ) {
			model.set( 'isInner', isInner );
		} else {
			model.isInner = isInner;
		}

		return BaseElementView.prototype.addChildModel.apply( this, arguments );
	},

	getSortableOptions: function() {
		var sectionConnectClass = this.isInner() ? '.kitbuilder-inner-section' : '.kitbuilder-top-section';

		return {
			connectWith: sectionConnectClass + ' > .kitbuilder-container > .kitbuilder-row',
			handle: '> .kitbuilder-element-overlay .kitbuilder-editor-column-settings-list .kitbuilder-editor-element-trigger',
			items: '> .kitbuilder-column'
		};
	},

	getColumnPercentSize: function( element, size ) {
		return size / element.parent().width() * 100;
	},

	getDefaultStructure: function() {
		return this.collection.length + '0';
	},

	getStructure: function() {
		return this.model.getSetting( 'structure' );
	},

	setStructure: function( structure ) {
		var parsedStructure = kitbuilder.presetsFactory.getParsedStructure( structure );

		if ( +parsedStructure.columnsCount !== this.collection.length ) {
			throw new TypeError( 'The provided structure doesn\'t match the columns count.' );
		}

		this.model.setSetting( 'structure', structure, true );
	},

	redefineLayout: function() {
		var preset = kitbuilder.presetsFactory.getPresetByStructure( this.getStructure() );

		this.collection.each( function( model, index ) {
			model.setSetting( '_column_size', preset.preset[ index ] );
			model.setSetting( '_inline_size', null );
		} );

		this.children.invoke( 'changeSizeUI' );
	},

	resetLayout: function() {
		this.setStructure( this.getDefaultStructure() );
	},

	resetColumnsCustomSize: function() {
		this.collection.each( function( model ) {
			model.setSetting( '_inline_size', null );
		} );

		this.children.invoke( 'changeSizeUI' );
	},

	isCollectionFilled: function() {
		var MAX_SIZE = 10,
			columnsCount = this.collection.length;

		return ( MAX_SIZE <= columnsCount );
	},

	_checkIsFull: function() {
		this.$el.toggleClass( 'kitbuilder-section-filled', this.isCollectionFilled() );
	},

	_checkIsEmpty: function() {
		if ( ! this.collection.length ) {
			this.addEmptyColumn();
		}
	},

	getNextColumn: function( columnView ) {
		var modelIndex = this.collection.indexOf( columnView.model ),
			nextModel = this.collection.at( modelIndex + 1 );

		return this.children.findByModelCid( nextModel.cid );
	},

	onBeforeRender: function() {
		this._checkIsEmpty();
	},

	onRender: function() {
		this._checkIsFull();
	},

	onAddChild: function() {
		if ( ! this.isBuffering ) {
			// Reset the layout just when we have really add/remove element.
			this.resetLayout();
		}
	},

	onRemoveChild: function() {
		if ( ! this.isManualRemoving ) {
			return;
		}

		// If it's the last column, please create new one.
		this._checkIsEmpty();

		this.resetLayout();
	},

	onChildviewRequestResizeStart: function( childView ) {
		var nextChildView = this.getNextColumn( childView );

		if ( ! nextChildView ) {
			return;
		}

		var $iframes = childView.$el.find( 'iframe' ).add( nextChildView.$el.find( 'iframe' ) );

		kitbuilder.helpers.disableElementEvents( $iframes );
	},

	onChildviewRequestResizeStop: function( childView ) {
		var nextChildView = this.getNextColumn( childView );

		if ( ! nextChildView ) {
			return;
		}

		var $iframes = childView.$el.find( 'iframe' ).add( nextChildView.$el.find( 'iframe' ) );

		kitbuilder.helpers.enableElementEvents( $iframes );
	},

	onChildviewRequestResize: function( childView, ui ) {
		// Get current column details
		var currentSize = childView.model.getSetting( '_inline_size' );

		if ( ! currentSize ) {
			currentSize = this.getColumnPercentSize( ui.element, ui.originalSize.width );
		}

		var newSize = this.getColumnPercentSize( ui.element, ui.size.width ),
			difference = newSize - currentSize;

		ui.element.css( {
			//width: currentSize + '%',
			width: '',
			left: 'initial' // Fix for RTL resizing
		} );

		// Get next column details
		var nextChildView = this.getNextColumn( childView );

		if ( ! nextChildView ) {
			return;
		}

		var MINIMUM_COLUMN_SIZE = 10,

			$nextElement = nextChildView.$el,
			nextElementCurrentSize = this.getColumnPercentSize( $nextElement, $nextElement.width() ),
			nextElementNewSize = nextElementCurrentSize - difference;

		if ( newSize < MINIMUM_COLUMN_SIZE || newSize > 100 || ! difference || nextElementNewSize < MINIMUM_COLUMN_SIZE || nextElementNewSize > 100 ) {
			return;
		}

		// Set the current column size
		childView.model.setSetting( '_inline_size', newSize.toFixed( 3 ) );
		childView.changeSizeUI();

		// Set the next column size
		nextChildView.model.setSetting( '_inline_size', nextElementNewSize.toFixed( 3 ) );
		nextChildView.changeSizeUI();
	},

	onStructureChanged: function() {
		this.redefineLayout();
	}
} );

module.exports = SectionView;

},{"kitbuilder-behaviors/duplicate":1,"kitbuilder-behaviors/handle-duplicate":2,"kitbuilder-behaviors/sortable":5,"kitbuilder-views/base-element":68}],101:[function(require,module,exports){
var BaseElementView = require( 'kitbuilder-views/base-element' ),
	WidgetView;

WidgetView = BaseElementView.extend( {
	_templateType: null,

	getTemplate: function() {
		var editModel = this.getEditModel();

		if ( 'remote' !== this.getTemplateType() ) {
			return Marionette.TemplateCache.get( '#tmpl-kitbuilder-' + editModel.get( 'elType' ) + '-' + editModel.get( 'widgetType' ) + '-content' );
		} else {
			return _.template( '' );
		}
	},

	className: function() {
		return BaseElementView.prototype.className.apply( this, arguments ) + ' kitbuilder-widget';
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events.click = 'onClickEdit';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		var editModel = this.getEditModel();

		editModel.on( {
			'before:remote:render': _.bind( this.onModelBeforeRemoteRender, this ),
			'remote:render': _.bind( this.onModelRemoteRender, this )
		} );

		if ( 'remote' === this.getTemplateType() && ! this.getEditModel().getHtmlCache() ) {
			editModel.renderRemoteServer();
		}
	},

	render: function() {
		if ( this.model.isRemoteRequestActive() ) {
			this.handleEmptyWidget();

			this.$el.addClass( 'kitbuilder-element' );

			return;
		}

		Marionette.CompositeView.prototype.render.apply( this, arguments );
	},

	handleEmptyWidget: function() {
		// TODO: REMOVE THIS !!
		// TEMP CODING !!
		this.$el
			.addClass( 'kitbuilder-widget-empty' )
			.append( '<i class="kitbuilder-widget-empty-icon ' + this.getEditModel().getIcon() + '"></i>' );
	},

	getTemplateType: function() {
		if ( null === this._templateType ) {
			var editModel = this.getEditModel(),
				$template = Backbone.$( '#tmpl-kitbuilder-' + editModel.get( 'elType' ) + '-' + editModel.get( 'widgetType' ) + '-content' );

			this._templateType = $template.length ? 'js' : 'remote';
		}

		return this._templateType;
	},

	onModelBeforeRemoteRender: function() {
		this.$el.addClass( 'kitbuilder-loading' );
	},

	onBeforeDestroy: function() {
		// Remove old style from the DOM.
		kitbuilder.$previewContents.find( '#kitbuilder-style-' + this.model.cid ).remove();
	},

	onModelRemoteRender: function() {
		if ( this.isDestroyed ) {
			return;
		}

		this.$el.removeClass( 'kitbuilder-loading' );
		this.render();
	},

	getHTMLContent: function( html ) {
		var htmlCache = this.getEditModel().getHtmlCache();

		return htmlCache || html;
	},

	attachElContent: function( html ) {
		var htmlContent = this.getHTMLContent( html ),
			el = this.$el[0];

		_.defer( function() {
			kitbuilderFrontend.getScopeWindow().jQuery( el ).html( htmlContent );
		} );

		return this;
	},

	onClickEdit: function( event ) {
		if ( Backbone.$( event.target ).closest( '.kitbuilder-event-save-default' ).length ) {
			return;
		}

		BaseElementView.prototype.onClickEdit.apply( this, arguments );
	},

	onRender: function() {
        var self = this,
	        editModel = self.getEditModel(),
	        skinType = editModel.getSetting( '_skin' ) || 'default';

        self.$el
	        .attr( 'data-element_type', editModel.get( 'widgetType' ) + '.' + skinType )
            .removeClass( 'kitbuilder-widget-empty' )
	        .addClass( 'kitbuilder-widget-' + editModel.get( 'widgetType' ) + ' kitbuilder-widget-can-edit' )
            .children( '.kitbuilder-widget-empty-icon' )
            .remove();

		// TODO: Find better way to detect if all images are loaded
		_.defer( function() {
			self.$el.imagesLoaded().always( function() {
				setTimeout( function() {
					if ( 1 > self.$el.height() ) {
						self.handleEmptyWidget();
					}
				}, 200 );
				// Is element empty?
			} );
		} );
	}
} );

module.exports = WidgetView;

},{"kitbuilder-views/base-element":68}],102:[function(require,module,exports){
'use strict';

/**
 * Handles managing all events for whatever you plug it into. Priorities for hooks are based on lowest to highest in
 * that, lowest priority hooks are fired first.
 */
var EventManager = function() {
	var slice = Array.prototype.slice,
		MethodsAvailable;

	/**
	 * Contains the hooks that get registered with this EventManager. The array for storage utilizes a "flat"
	 * object literal such that looking up the hook utilizes the native object literal hash.
	 */
	var STORAGE = {
		actions: {},
		filters: {}
	};

	/**
	 * Removes the specified hook by resetting the value of it.
	 *
	 * @param type Type of hook, either 'actions' or 'filters'
	 * @param hook The hook (namespace.identifier) to remove
	 *
	 * @private
	 */
	function _removeHook( type, hook, callback, context ) {
		var handlers, handler, i;

		if ( ! STORAGE[ type ][ hook ] ) {
			return;
		}
		if ( ! callback ) {
			STORAGE[ type ][ hook ] = [];
		} else {
			handlers = STORAGE[ type ][ hook ];
			if ( ! context ) {
				for ( i = handlers.length; i--; ) {
					if ( handlers[ i ].callback === callback ) {
						handlers.splice( i, 1 );
					}
				}
			} else {
				for ( i = handlers.length; i--; ) {
					handler = handlers[ i ];
					if ( handler.callback === callback && handler.context === context ) {
						handlers.splice( i, 1 );
					}
				}
			}
		}
	}

	/**
	 * Use an insert sort for keeping our hooks organized based on priority. This function is ridiculously faster
	 * than bubble sort, etc: http://jsperf.com/javascript-sort
	 *
	 * @param hooks The custom array containing all of the appropriate hooks to perform an insert sort on.
	 * @private
	 */
	function _hookInsertSort( hooks ) {
		var tmpHook, j, prevHook;
		for ( var i = 1, len = hooks.length; i < len; i++ ) {
			tmpHook = hooks[ i ];
			j = i;
			while ( ( prevHook = hooks[ j - 1 ] ) && prevHook.priority > tmpHook.priority ) {
				hooks[ j ] = hooks[ j - 1 ];
				--j;
			}
			hooks[ j ] = tmpHook;
		}

		return hooks;
	}

	/**
	 * Adds the hook to the appropriate storage container
	 *
	 * @param type 'actions' or 'filters'
	 * @param hook The hook (namespace.identifier) to add to our event manager
	 * @param callback The function that will be called when the hook is executed.
	 * @param priority The priority of this hook. Must be an integer.
	 * @param [context] A value to be used for this
	 * @private
	 */
	function _addHook( type, hook, callback, priority, context ) {
		var hookObject = {
			callback: callback,
			priority: priority,
			context: context
		};

		// Utilize 'prop itself' : http://jsperf.com/hasownproperty-vs-in-vs-undefined/19
		var hooks = STORAGE[ type ][ hook ];
		if ( hooks ) {
			// TEMP FIX BUG
			var hasSameCallback = false;
			jQuery.each( hooks, function() {
				if ( this.callback === callback ) {
					hasSameCallback = true;
					return false;
				}
			} );

			if ( hasSameCallback ) {
				return;
			}
			// END TEMP FIX BUG

			hooks.push( hookObject );
			hooks = _hookInsertSort( hooks );
		} else {
			hooks = [ hookObject ];
		}

		STORAGE[ type ][ hook ] = hooks;
	}

	/**
	 * Runs the specified hook. If it is an action, the value is not modified but if it is a filter, it is.
	 *
	 * @param type 'actions' or 'filters'
	 * @param hook The hook ( namespace.identifier ) to be ran.
	 * @param args Arguments to pass to the action/filter. If it's a filter, args is actually a single parameter.
	 * @private
	 */
	function _runHook( type, hook, args ) {
		var handlers = STORAGE[ type ][ hook ], i, len;

		if ( ! handlers ) {
			return ( 'filters' === type ) ? args[ 0 ] : false;
		}

		len = handlers.length;
		if ( 'filters' === type ) {
			for ( i = 0; i < len; i++ ) {
				args[ 0 ] = handlers[ i ].callback.apply( handlers[ i ].context, args );
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				handlers[ i ].callback.apply( handlers[ i ].context, args );
			}
		}

		return ( 'filters' === type ) ? args[ 0 ] : true;
	}

	/**
	 * Adds an action to the event manager.
	 *
	 * @param action Must contain namespace.identifier
	 * @param callback Must be a valid callback function before this action is added
	 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
	 * @param [context] Supply a value to be used for this
	 */
	function addAction( action, callback, priority, context ) {
		if ( 'string' === typeof action && 'function' === typeof callback ) {
			priority = parseInt( ( priority || 10 ), 10 );
			_addHook( 'actions', action, callback, priority, context );
		}

		return MethodsAvailable;
	}

	/**
	 * Performs an action if it exists. You can pass as many arguments as you want to this function; the only rule is
	 * that the first argument must always be the action.
	 */
	function doAction( /* action, arg1, arg2, ... */ ) {
		var args = slice.call( arguments );
		var action = args.shift();

		if ( 'string' === typeof action ) {
			_runHook( 'actions', action, args );
		}

		return MethodsAvailable;
	}

	/**
	 * Removes the specified action if it contains a namespace.identifier & exists.
	 *
	 * @param action The action to remove
	 * @param [callback] Callback function to remove
	 */
	function removeAction( action, callback ) {
		if ( 'string' === typeof action ) {
			_removeHook( 'actions', action, callback );
		}

		return MethodsAvailable;
	}

	/**
	 * Adds a filter to the event manager.
	 *
	 * @param filter Must contain namespace.identifier
	 * @param callback Must be a valid callback function before this action is added
	 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
	 * @param [context] Supply a value to be used for this
	 */
	function addFilter( filter, callback, priority, context ) {
		if ( 'string' === typeof filter && 'function' === typeof callback ) {
			priority = parseInt( ( priority || 10 ), 10 );
			_addHook( 'filters', filter, callback, priority, context );
		}

		return MethodsAvailable;
	}

	/**
	 * Performs a filter if it exists. You should only ever pass 1 argument to be filtered. The only rule is that
	 * the first argument must always be the filter.
	 */
	function applyFilters( /* filter, filtered arg, arg2, ... */ ) {
		var args = slice.call( arguments );
		var filter = args.shift();

		if ( 'string' === typeof filter ) {
			return _runHook( 'filters', filter, args );
		}

		return MethodsAvailable;
	}

	/**
	 * Removes the specified filter if it contains a namespace.identifier & exists.
	 *
	 * @param filter The action to remove
	 * @param [callback] Callback function to remove
	 */
	function removeFilter( filter, callback ) {
		if ( 'string' === typeof filter ) {
			_removeHook( 'filters', filter, callback );
		}

		return MethodsAvailable;
	}

	/**
	 * Maintain a reference to the object scope so our public methods never get confusing.
	 */
	MethodsAvailable = {
		removeFilter: removeFilter,
		applyFilters: applyFilters,
		addFilter: addFilter,
		removeAction: removeAction,
		doAction: doAction,
		addAction: addAction
	};

	// return all of the publicly available methods
	return MethodsAvailable;
};

module.exports = EventManager;

},{}],103:[function(require,module,exports){
var Module = function() {
	var $ = jQuery,
		instanceParams = arguments,
		self = this,
		settings,
		events = {};

	var ensureClosureMethods = function() {
		$.each( self, function( methodName ) {
			var oldMethod = self[ methodName ];

			if ( 'function' !== typeof oldMethod ) {
				return;
			}

			self[ methodName ] = function() {
				return oldMethod.apply( self, arguments );
			};
		});
	};

	var initSettings = function() {
		settings = self.getDefaultSettings();

		var instanceSettings = instanceParams[0];

		if ( instanceSettings ) {
			$.extend( settings, instanceSettings );
		}
	};

	var init = function() {
		self.__construct.apply( self, instanceParams );

		ensureClosureMethods();

		initSettings();

		self.trigger( 'init' );
	};

	this.getItems = function( items, itemKey ) {
		if ( itemKey ) {
			var keyStack = itemKey.split( '.' ),
				currentKey = keyStack.splice( 0, 1 );

			if ( ! keyStack.length ) {
				return items[ currentKey ];
			}

			if ( ! items[ currentKey ] ) {
				return;
			}

			return this.getItems(  items[ currentKey ], keyStack.join( '.' ) );
		}

		return items;
	};

	this.getSettings = function( setting ) {
		return this.getItems( settings, setting );
	};

	this.setSettings = function( settingKey, value, settingsContainer ) {
		if ( ! settingsContainer ) {
			settingsContainer = settings;
		}

		if ( 'object' === typeof settingKey ) {
			$.extend( settingsContainer, settingKey );

			return self;
		}

		var keyStack = settingKey.split( '.' ),
			currentKey = keyStack.splice( 0, 1 );

		if ( ! keyStack.length ) {
			settingsContainer[ currentKey ] = value;

			return self;
		}

		if ( ! settingsContainer[ currentKey ] ) {
			settingsContainer[ currentKey ] = {};
		}

		return self.setSettings( keyStack.join( '.' ), value, settingsContainer[ currentKey ] );
	};

	this.on = function( eventName, callback ) {
		if ( ! events[ eventName ] ) {
			events[ eventName ] = [];
		}

		events[ eventName ].push( callback );

		return self;
	};

	this.off = function( eventName, callback ) {
		if ( ! events[ eventName ] ) {
			return self;
		}

		if ( ! callback ) {
			delete events[ eventName ];

			return self;
		}

		var callbackIndex = events[ eventName ].indexOf( callback );

		if ( -1 !== callbackIndex ) {
			delete events[ eventName ][ callbackIndex ];
		}

		return self;
	};

	this.trigger = function( eventName ) {
		var methodName = 'on' + eventName[ 0 ].toUpperCase() + eventName.slice( 1 ),
			params = Array.prototype.slice.call( arguments, 1 );

		if ( self[ methodName ] ) {
			self[ methodName ].apply( self, params );
		}

		var callbacks = events[ eventName ];

		if ( ! callbacks ) {
			return;
		}

		$.each( callbacks, function( index, callback ) {
			callback.apply( self, params );
		} );
	};

	init();
};

Module.prototype.__construct = function() {};

Module.prototype.getDefaultSettings = function() {
	return {};
};

Module.extend = function( properties ) {
	var $ = jQuery,
		parent = this;

	var child = function() {
		return parent.apply( this, arguments );
	};

	$.extend( child, parent );

	child.prototype = Object.create( $.extend( {}, parent.prototype, properties ) );

	child.prototype.constructor = child;

	child.__super__ = parent.prototype;

	return child;
};

module.exports = Module;

},{}],104:[function(require,module,exports){
var Module = require( './module' ),
	ViewModule;

ViewModule = Module.extend( {
	elements: null,

	getDefaultElements: function() {
		return {};
	},

	bindEvents: function() {},

	onInit: function() {
		this.initElements();

		this.bindEvents();
	},

	initElements: function() {
		this.elements = this.getDefaultElements();
	}
} );

module.exports = ViewModule;

},{"./module":103}]},{},[63,64,32])
//# sourceMappingURL=editor.js.map
