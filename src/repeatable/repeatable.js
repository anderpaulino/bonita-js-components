angular.module('bonita.repeatable', [])
  .directive('columnTemplate', function ($compile) {
    return {
      restrict: 'A',
      scope: {
        template: '=columnTemplate',
      },
      link: function (scope, element) {
        var template = angular.element(scope.template);
        var wrapper = angular.element('<div></div>');
        angular.forEach(template[0].attributes, function (attribute) {
          wrapper.attr(attribute.name, template.attr(attribute.name));
        });
        element.append($compile(wrapper.append(template.contents()))(scope.$parent));
      }
    };
  })
  .directive('boRepeatable', function () {
    return {
      restrict: 'A',
      compile: function (elem, attr) {

        var thSelecter  = attr[this.name] || 'thead tr:last-child';
        var tdSelecter = 'tr[ng-repeat]';

        var header = elem[0].querySelector(thSelecter);
        var row = elem[0].querySelector(tdSelecter);

        if (!header || !row || header.children.length !== row.children.length) {
          throw new Error('bo-repeatable th number does not correspond to td number. please verify you html table');
        }

        var columns = [];
        var tdCells =  row.children;


        /**
         * filter helper to test if data-ignore attribute is present on a Node
         * @param  {Object} item  an object containing both th and td node
         * @return {Boolean}      true id data-ignore is present
         */
        function filterIgnoreCell(item){
          return item.th.getAttribute('data-ignore') === null;
        }

        /**
         * dynamic filter function for filtering repeated columns
         * @param  {string}  Prop
         * @param  {Object}  column
         * @return {Boolean}
         */
        function columnFilter(prop, column) {
          return column[prop] === true;
        }
        var prop = attr.visibleProp || 'visible';

        columns = [].map.call(header.children, function(th, index) {
            return {th: th, td: tdCells[index]};
          })
          .filter(filterIgnoreCell)
          .map(function(item){
              angular.element(item.th).remove();
              angular.element(item.td).remove();
              var o = {
                name: item.th.textContent,
                header: item.th.outerHTML,
                cell: item.td.outerHTML
              };
              o[prop] = true;
              return o;
            });

        angular.element(header)
          .append('<th column-template="column.header" ng-repeat="column in $columns | filter:$visibilityFilter"></th>');
        angular.element(row)
          .append('<td column-template="column.cell" ng-repeat="column in $columns | filter:$visibilityFilter"></td>');
        return function (scope) {
          scope.$columns = columns;
          scope.$visibilityFilter = columnFilter.bind(null, prop);
        };
      }
    };
  })
  .directive('repeatableConfig', function(){
    return {
      priority:1,
      link: function(scope, elem, attr){
        scope.$watch(attr.repeatableConfig, function(visibleConfig){

          var prop = attr.visibleProp || 'visible';
          if (visibleConfig.length !== scope.$columns.length) {
            throw new Error('repeatable-config size differ from $columns size. Please check your config attr');
          }

          scope.$columns.forEach(function(item, index){
            item[prop] = visibleConfig[index];
          });
        });
      }
    };
  });
