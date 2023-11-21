var builder = WebApplication.CreateBuilder(args);

var tokenParams = builder.Configuration.GetSection("TokenValidationParametersConfiguration");

builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("EmailConfiguration"));

builder.Services.Configure<TokenValidationParametersConfiguration>(builder.Configuration
    .GetSection("TokenValidationParametersConfiguration"));

builder.Services.AddSingleton<SmtpClient>();

builder.Services.AddSingleton<VoteSystemContext>();

builder.Services.AddSingleton<ILoggerProvider, DatabaseLoggerProvider>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add(new ProducesAttribute("application/json"));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Tu API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingrese el token JWT con el formato 'Bearer {token}'.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer",
                },
                Description = "Ingrese el token JWT con el formato 'Bearer {token}'.",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            },
            Array.Empty<string>()
        }
    });


});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddCookie()
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.HttpContext.Request.Cookies[AuthController.Authorization];
                if (context.Token != null)
                {
                    context.Token = context.Token.Substring("Bearer ".Length).Trim();
                }
                else if (context.Token == null && builder.Environment.IsDevelopment())
                {
                    context.Token = context.HttpContext.Request.Headers[AuthController.Authorization];
                    if (context.Token != null)
                    {
                        context.Token = context.Token.Substring("Bearer ".Length).Trim();
                    }
                }
                return Task.CompletedTask;
            }
        };
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = tokenParams.GetValue<string>("Issuer"),
            ValidAudience = tokenParams.GetValue<string>("Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenParams
                        .GetValue<string>("IssuerSigningKey")!))
        };
    });


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCookiePolicy();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
