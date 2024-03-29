import { SCLTag } from '../utils/scldata.js';
export declare const voidSelector = ":not(*)";
export declare function selector(tagName: string, identity: string | number): string;
export declare function findElement(root: XMLDocument | Element, { tagName, identity }: {
    tagName: SCLTag;
    identity: string;
}): Element | null;
export declare function hitemSelector(tagName: SCLTag, identity: string): string;
export declare function terminalSelector(tagName: SCLTag, identity: string): string;
export declare function lNodeSelector(tagName: SCLTag, identity: string): string;
export declare function kDCSelector(tagName: SCLTag, identity: string): string;
export declare function associationSelector(tagName: SCLTag, identity: string): string;
export declare function lDeviceSelector(tagName: SCLTag, identity: string): string;
export declare function iEDNameSelector(tagName: SCLTag, identity: string): string;
export declare function fCDASelector(tagName: SCLTag, identity: string): string;
export declare function extRefSelector(tagName: SCLTag, identity: string): string;
export declare function lNSelector(tagName: SCLTag, identity: string): string;
export declare function clientLNSelector(tagName: SCLTag, identity: string): string;
export declare function ixNamingSelector(tagName: SCLTag, identity: string, depth?: number): string;
export declare function valSelector(tagName: SCLTag, identity: string): string;
export declare function connectedAPSelector(tagName: SCLTag, identity: string): string;
export declare function controlBlockSelector(tagName: SCLTag, identity: string): string;
export declare function physConnSelector(tagName: SCLTag, identity: string): string;
export declare function pSelector(tagName: SCLTag, identity: string): string;
export declare function enumValSelector(tagName: SCLTag, identity: string): string;
export declare function protNsSelector(tagName: SCLTag, identity: string): string;
export declare function sCLSelector(): string;
export declare function namingSelector(tagName: SCLTag, identity: string, depth?: number): string;
export declare function singletonSelector(tagName: SCLTag, identity: string): string;
export declare function idNamingSelector(tagName: SCLTag, identity: string): string;
