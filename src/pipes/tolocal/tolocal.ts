import { Pipe } from '@angular/core'
import * as moment from 'moment'

/**
 * Generated class for the TolocalPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'tolocal',
})
export class TolocalPipe {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return moment(value).format('MMM Do hh:mm')
  }
}
