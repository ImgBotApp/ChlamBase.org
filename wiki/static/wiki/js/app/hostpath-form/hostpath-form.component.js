angular
    .module('hostpathForm')
    .component('hostpathForm', {
        bindings: {
            data: '<'
        },
        controller: function ($location, $routeParams, speciesGenes, pubMedData, sendToView) {
            var ctrl = this;

            ctrl.pageCount = 0;

            ctrl.nextClick = function () {
                ctrl.pageCount += 1;
            };

            ctrl.backClick = function () {
                ctrl.pageCount -= 1;
            };

            ctrl.hostpathAnnotation = {
                obj_locus_tag: $routeParams.locusTag,
                host_species: null
            };

            ctrl.species = [
                {
                    name: 'Homo sapiens',
                    qid: 'Q15978631',
                    taxid: '9606'
                },
                {
                    name: 'Mus musculus',
                    qid: 'Q83310',
                    taxid: '10090'
                }
            ];

            ctrl.determination_methods = [{
                "item": "http://www.wikidata.org/entity/Q32860428",
                "itemLabel": "immunoprecipitation evidence",
                "eco": "ECO:0000085"
            }, {
                "item": "http://www.wikidata.org/entity/Q32860432",
                "itemLabel": "co-localization evidence",
                "eco": "ECO:0001026"
            }];

            ctrl.getSpeciesGenes = function () {
                var taxid = ctrl.hostpathAnnotation.host_species.taxid;
                speciesGenes.getSpeciesGenes(taxid)
                    .then(function (data) {
                        ctrl.speciesGenes = data.data.results.bindings;
                    });
            };
            ctrl.selectProtein = function ($item, $model, $value) {
                ctrl.hostpathAnnotation.host_protein = $item;
            };

            ctrl.getPMID = function (val) {
                return pubMedData.getPMID(val).then(
                    function (data) {
                        var resultData = [data.data.result[val]];
                        return resultData.map(function (item) {
                            return item;
                        });
                    }
                );
            };
            ctrl.selectPub = function ($item, $model, $label) {
                ctrl.pubValue = $item;
            };
            ctrl.sendData = function (formData) {
                ctrl.loading = true;
                var url_suf = $location.path() + '/wd_hostpath_edit';
                sendToView.sendToView(url_suf, formData).then(function (data) {
                    if (data.data.authentication === false){
                        console.log(data);
                        alert('please authorize ChlamBase to edit Wikidata on your behalf!')
                    }
                    if (data.data.success === true) {
                        console.log(data);
                        alert("Successfully Annotated! Well Done! The annotation will appear here in a few minutes.");
                        ctrl.resetForm();
                    }
                    else {
                        console.log(data);
                        alert("Something went wrong.  Give it another shot!");
                    }
                }).finally(function () {
                    ctrl.loading = false;
                });

            };
            ctrl.resetForm = function () {
                ctrl.pageCount = 0;
                ctrl.hostpathAnnotation = {
                    obj_locus_tag: $routeParams.locusTag,
                    host_species: null
                };

            };
        },


        templateUrl: '/static/wiki/js/angular_templates/hostpath-form.html'
    });


