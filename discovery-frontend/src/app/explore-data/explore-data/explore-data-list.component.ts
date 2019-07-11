/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, ElementRef, EventEmitter, Injector, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import * as _ from "lodash";
import {StringUtil} from "../../common/util/string.util";
import {Metadata, SourceType} from "../../domain/meta-data-management/metadata";
import {ExploreDataConstant} from "../constant/explore-data-constant";
import {MetadataService} from "../../meta-data-management/metadata/service/metadata.service";
import {CommonConstant} from "../../common/constant/common.constant";
import {ExploreDataModelService} from "./service/explore-data-model.service";

@Component({
  selector: 'explore-data-list',
  templateUrl: './explore-data-list.component.html',
})
export class ExploreDataListComponent extends AbstractComponent {

  title: string;
  metadataList: Metadata[];

  // event
  @Output() readonly clickedMetadata = new EventEmitter();

  // 생성자
  constructor(private metadataService: MetadataService,
              private exploreDataModelService: ExploreDataModelService,
              protected element: ElementRef,
              protected injector: Injector) {
    super(element, injector);
  }

  initMetadataList(): void {
    this._setTitle();
    this.page.page = 0;
    this.page.size = CommonConstant.API_CONSTANT.PAGE_SIZE;
    this._setMetadataList(this._getMetadataListParams());
  }

  getConvertedMetadataType(sourceType: SourceType) {
    switch (sourceType) {
      case SourceType.ENGINE:
        return this.translateService.instant('msg.comm.th.ds');
      case SourceType.JDBC:
        return this.translateService.instant('msg.storage.li.db');
      case SourceType.STAGEDB:
        return this.translateService.instant('msg.storage.li.hive');
    }
  }

  isEmptyMetadataList(): boolean {
    return _.isNil(this.metadataList) || this.metadataList.length === 0;
  }

  isEnableTag(metadata: Metadata): boolean {
    return !Metadata.isEmptyTags(metadata);
  }

  isEnableDescription(metadata: Metadata): boolean {
    return StringUtil.isNotEmpty(metadata.description);
  }

  /**
   * More connection click event
   */
  changePage(data: { page: number, size: number }): void {
    // if more metadata list
    if (data) {
      this.page.page = data.page;
      this.page.size = data.size;
      this._setMetadataList(this._getMetadataListParams());
    }
  }

  onClickMetadata(metadata: Metadata): void {
    this.clickedMetadata.emit(metadata);
  }

  private _getMetadataListParams() {
    const result = {
      page: this.page.page,
      size: this.page.size,
    };
    // if not empty search keyword
    if (StringUtil.isNotEmpty(this.exploreDataModelService.searchKeyword)) {
      result[this.exploreDataModelService.selectedSearchRange.value] = this.exploreDataModelService.searchKeyword.trim();
    }
    if (this.exploreDataModelService.selectedLnbTab === ExploreDataConstant.LnbTab.CATALOG && !_.isNil(this.exploreDataModelService.selectedCatalog)) {
      result['catalogId'] = this.exploreDataModelService.selectedCatalog.id;
    } else if (this.exploreDataModelService.selectedLnbTab === ExploreDataConstant.LnbTab.TAG && !_.isNil(this.exploreDataModelService.selectedTag)) {
      result['tag'] = this.exploreDataModelService.selectedTag.name;
    }
    return result;
  }

  private _setMetadataList(params) {
    this.loadingShow();
    this.metadataService.getMetaDataList(params)
      .then((result) => {

        this.pageResult = result.page;

        if (result._embedded) {
          this.metadataList = result._embedded.metadatas;
        } else {
          this.metadataList = [];
        }
        this.loadingHide();
      })
      .catch(error => this.commonExceptionHandler(error));
  }

  private _setTitle(): void {
    if (this.exploreDataModelService.selectedLnbTab === ExploreDataConstant.LnbTab.CATALOG && !_.isNil(this.exploreDataModelService.selectedCatalog)) {
      this.title = this.exploreDataModelService.selectedCatalog.name;
    } else if (this.exploreDataModelService.selectedLnbTab === ExploreDataConstant.LnbTab.TAG && !_.isNil(this.exploreDataModelService.selectedTag)) {
      this.title = this.exploreDataModelService.selectedTag.name;
    } else {
      this.title = undefined;
    }
  }
}
