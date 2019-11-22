//Lab linear regression
var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
var India = countries.filterMetadata('Country','equals','India')
// This function adds a band for image timestamp
var addTime = function(image){
  return image. addBands(image.metadata('system:time_start')
  .divide(1000*60*60*24*365));
  
};

// Load a MODIS collection, filter to 15 years of 16 day mosaics,
// and map the time band function over it.
var collection = ee.ImageCollection('MODIS/006/MYD13A1')
  .filterDate('2002-01-01', '2017-12-31')
  .map(addTime)
  .filterBounds(India);
  
// Select the bands to model with the independent variable first.
var trend = collection.select(['system:time_start', 'NDVI'])
  // Compute the linear trend over time.
  .reduce(ee.Reducer.linearFit());
  
  // Display the trend with increasing slopes in green, decreasing in red.
Map.centerObject(India, 6);
Map.addLayer(trend.clip(India), {min: 0, max: [-100, 100, 10000], bands: ['scale', 'scale', 'offset']}, 'NDVI Trend in India');
// create vizualization parameters
var viz = {min: 0, max: 10000,palette:['d600ff','0000FF','21f600','b7f0ae']};

// set position of panel
var legend = ui.Panel({
style: {
position: 'bottom-left',
padding: '8px 15px'
}
});
 
// Create legend title
var legendTitle = ui.Label({
value: 'NDVI (India)',
style: {
fontWeight: 'bold',
fontSize: '18px',
margin: '0 0 4px 0',
padding: '0'
}
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// create the legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((viz.max-viz.min)/100.0).add(viz.min);
var legendImage = gradient.visualize(viz);
 
// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label(viz['max'])
],
});
 
legend.add(panel);
 
// create thumbnail from the image
var thumbnail = ui.Thumbnail({
image: legendImage,
params: {bbox:'0,0,10,100', dimensions:'10x200'},
style: {padding: '1px', position: 'bottom-center'}
});
 
// add the thumbnail to the legend
legend.add(thumbnail);
 
// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label(viz['min'])
],
});
 
legend.add(panel);
 
Map.add(legend);