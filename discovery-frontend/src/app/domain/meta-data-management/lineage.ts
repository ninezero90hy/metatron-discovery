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

import { AbstractHistoryEntity } from '../common/abstract-history-entity';
import { Metadata } from './metadata';

export class Lineage extends AbstractHistoryEntity {
  // id
  public id: string;
  // from domain 명
  public fromodomain: string;
  // from schema
  public fromschema: string;
  //
  public fromdata: Metadata;
  //
  public fromcolumn: string;
  // to domain 명
  public toodomain: string;
  // to schema
  public toschema: string;
  //
  public todata: Metadata;
  //
  public tocolumn: string;
}