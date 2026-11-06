/** What the application gives a laboratory while it is open. */
export interface LabContext {
  /** Empty full-screen element. The laboratory creates its own canvas, engine and controls here. */
  host:HTMLElement;
  /** Reading the laboratory was opened from (`LearningContent.id`). */
  contentId:string;
  /** Close the laboratory and return to its reading. */
  exit:()=>void;
}
/** A laboratory outside the electronics runtime. It owns everything it creates and releases it in `unmount`. */
export interface LabModule {
  mount(context:LabContext):void|Promise<void>;
  unmount():void;
}
export type LabRegistry=Record<string,()=>Promise<LabModule>>;
