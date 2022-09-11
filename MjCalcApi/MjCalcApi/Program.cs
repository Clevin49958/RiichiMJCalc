using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.CustomServices;
using MjCalcApi.AppServices.ICustomServices;
using MjCalcApi.AppServices.IRepository;
using MjCalcApi.AppServices.Repository;
using MjCalcApi.Domain.Data;
using MjCalcApi.Domain.Game;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("https://green-stone-0ab887800.1.azurestaticapps.net/");
        });
});
builder.Services.AddControllers();
builder.Services.AddDbContext<MjCalcDbContext>(opt => opt.UseInMemoryDatabase("MjCalc"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#region Service Injected
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ICustomService<GameInstance>, GameService>();
#endregion

var app = builder.Build();

app.UseSwagger();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();
app.UseAuthorization();

app.MapControllers();

app.Run();
