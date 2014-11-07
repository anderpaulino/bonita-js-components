'use strict';

describe('multiselect directive', function(){
  var element;
  var controller;

  beforeEach(module('bonitable'));
  beforeEach(module('bonita.selectable'));
  beforeEach(module('bonita.templates'));

  beforeEach(inject(function($rootScope, $compile, $httpBackend) {
    var scope = $rootScope.$new();

    $httpBackend.whenGET(/^template/).respond('');

    var markup =
        '<div>'+
        '<table bonitable>'+
        '  <thead>'+
        '    <tr>'+
        '       <th><div bo-selectall></div></th>'+
        '       <th>label</th>'+
        '    </tr>'+
        '  </thead>'+
        '  <tbody>'+
        '    <tr ng-repeat="tag in tags">'+
        '       <td><input type="checkbox" bo-selector="tag" ng-model="tag.$selected"></td>'+
        '       <td>{{tag.label}}</td>'+
        '    </tr>'+
        '  </tbody>'+
        '</table>'+
        '</div>';

    scope.tags = [{label:'blue'},{label:'red'}, {label:'green'}];
    element = $compile(markup)(scope);
    controller = element.controller('boSelectable');
    scope.$digest();
  }));

  describe('bo-selecter', function(){
    it('should  update $selected items', function(){
      var checkbox = element.find('tbody input[type=checkbox]').eq(0);
      var scope = element.find('table').scope();
      expect(scope.$selectedItems.length).toBe(0);
      checkbox.click();
      expect(scope.$selectedItems.length).toBe(1);
    });
  });

  describe('selectAll', function(){
    it('should toggle all items', function(){
      var scope = element.find('table').scope();
      var checkbox = element.find('th input[type=checkbox]');
      checkbox.click();
      scope.$digest();
      expect(scope.$selectedItems.length).toBe(scope.tags.length);
      checkbox.click();
      expect(scope.$selectedItems.length).toBe(0);
    });
  });
});