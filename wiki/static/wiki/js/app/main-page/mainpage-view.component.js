angular
    .module('mainPage')
    .component('mainPage', {
        controller: function ($filter, $location, allChlamOrgs, wdGetEntities, entrez2QID) {
            //Main gene page component.
            var ctrl = this;
            ctrl.$onInit = function () {
                ctrl.currentGene = {
                    entrez: $location.path().split("/")[4],
                    geneAliases: [],
                    proteinAliases: []
                };
                entrez2QID.getEntrez2QID(ctrl.currentGene.entrez).then(function (data) {
                        ctrl.currentGene.geneQID = $filter('parseQID')(data.data.results.bindings[0].gene.value);
                        ctrl.currentGene.proteinQID = $filter('parseQID')(data.data.results.bindings[0].protein.value);
                        wdGetEntities.wdGetEntities(ctrl.currentGene.geneQID).then(function (data) {
                            var entity = data.entities[ctrl.currentGene.geneQID];
                            //console.log(entity);
                            ctrl.currentGene.geneLabel = entity.labels.en.value;
                            ctrl.currentGene.locusTag = entity.claims.P2393[0].mainsnak.datavalue.value;
                            ctrl.currentGene.description = entity.descriptions.en.value;
                            ctrl.currentGene.genStart = entity.claims.P644[0].mainsnak.datavalue.value;
                            ctrl.currentGene.genEnd = entity.claims.P645[0].mainsnak.datavalue.value;
                            ctrl.currentGene.strand = entity.claims.P2548[0].mainsnak.datavalue.value;
                            ctrl.currentGene.refseqGenome = entity.claims.P644[0].qualifiers.P2249[0].datavalue.value;
                            ctrl.currentGene.geneType = entity.claims.P279[0].mainsnak.datavalue.value;
                            angular.forEach(entity.aliases.en, function (alias) {
                                if(alias.value != ctrl.currentGene.locusTag){
                                    ctrl.currentGene.geneAliases.push(alias.value);
                                }
                            });
                        });
                        wdGetEntities.wdGetEntities(ctrl.currentGene.proteinQID).then(function (data) {
                            var entity = data.entities[ctrl.currentGene.proteinQID];
                            //console.log(entity);
                            ctrl.currentGene.proteinLabel = entity.labels.en.value;
                            ctrl.currentGene.description = entity.descriptions.en.value;
                            angular.forEach(entity.aliases.en, function (alias) {
                                ctrl.currentGene.proteinAliases.push(alias.value);
                            });
                            ctrl.currentGene.uniprot = entity.claims.P352[0].mainsnak.datavalue.value;
                            ctrl.currentGene.refseqProt = entity.claims.P637[0].mainsnak.datavalue.value;
                            ctrl.currentGene.productType = entity.claims.P279[0].mainsnak.datavalue.value;

                        });
                        allChlamOrgs.getAllOrgs(function (data) {
                            ctrl.orgList = data;
                            ctrl.currentOrg = $filter('getJsonItemOrg')('taxid', ctrl.currentTaxid, ctrl.orgList);
                            if (ctrl.currentOrg == undefined) {
                                alert("not a valid taxonomy id");
                                $location.path('/');
                            }
                        });
                        ctrl.currentTaxid = $location.path().split("/")[2];

                    }
                );
            };


        },
        templateUrl: '/static/wiki/js/angular_templates/main-page_new.html'
    });


