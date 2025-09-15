using WiredBrainApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IInventoryService, InventoryService>();

// CORS policy for local React dev server
var allowedOrigins = new[] { "http://localhost:5173", "http://127.0.0.1:5173" };
builder.Services.AddCors(options =>
{
	options.AddPolicy("ClientCors", policy =>
	{
		policy.WithOrigins(allowedOrigins)
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("ClientCors");

// Enable default file mapping (e.g., index.html) and static file serving
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

// SPA Fallback: if React build is present in wwwroot, serve index.html for client-side routes
app.MapFallback(async context =>
{
	// Only trigger for HTML requests (avoid interfering with API 404s or static assets)
	if (!context.Request.Path.StartsWithSegments("/swagger") &&
		!context.Request.Path.StartsWithSegments("/Inventory"))
	{
		context.Response.ContentType = "text/html";
		await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "index.html"));
	}
});

app.Run();

// Expose Program class for integration testing (WebApplicationFactory)
public partial class Program { }
