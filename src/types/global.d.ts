// Add mongoose to global type definitions
declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}