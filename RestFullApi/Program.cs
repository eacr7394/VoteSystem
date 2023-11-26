var builder = WebApplication.CreateBuilder(args);

var tokenParams = builder.Configuration.GetSection("TokenValidationParametersConfiguration");

string[] allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowOrigins").Get<string[]>()!;
string[] allowedHeaders = builder.Configuration.GetSection("CorsSettings:AllowHeaders").Get<string[]>()!;
string[] allowedMethods = builder.Configuration.GetSection("CorsSettings:AllowMethods").Get<string[]>()!;
string[] allowedExposedHeaders = builder.Configuration.GetSection("CorsSettings:AllowExposedHeaders").Get<string[]>()!;

builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("EmailConfiguration"));

builder.Services.Configure<TokenValidationParametersConfiguration>(builder.Configuration
    .GetSection("TokenValidationParametersConfiguration"));


builder.Services.AddSingleton<ILoggerProvider, DatabaseLoggerProvider>();

builder.Services.AddSingleton<IJob, SendUserVotingTask>();


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
                context.Token = context.HttpContext.Request.Cookies[JwtToken.Authorization];
                if (context.Token != null)
                {
                    context.Token = context.Token.Substring("Bearer ".Length).Trim();
                }
                else if (context.Token == null && builder.Environment.IsDevelopment())
                {
                    context.Token = context.HttpContext.Request.Headers[JwtToken.Authorization];
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins(allowedOrigins)
                   .WithHeaders(allowedHeaders)
                   .WithMethods(allowedMethods)
                   .WithExposedHeaders(allowedExposedHeaders)
                   .AllowCredentials();
        });
});

builder.Services.AddQuartz(q =>
{
    var sendUserVotingTask = new JobKey("SendUserVotingTask");
    q.AddJob<SendUserVotingTask>(opts => opts.WithIdentity(sendUserVotingTask));
    q.AddTrigger(opts => opts
        .ForJob(sendUserVotingTask)
        .WithIdentity("SendUserVotingTask-trigger")
        .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(15)
                    .RepeatForever())
    );

    var sendUserVotingResultTask = new JobKey("SendUserVotingResultTask");
    q.AddJob<SendUserVotingResultTask>(opts => opts.WithIdentity(sendUserVotingResultTask));
    q.AddTrigger(opts => opts
        .ForJob(sendUserVotingResultTask)
        .WithIdentity("SendUserVotingResultTask-trigger")
        .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(30)
                    .RepeatForever())
    );

    var sendUserVotingQuorumTask = new JobKey("SendUserVotingQuorumTask");
    q.AddJob<SendUserVotingQuorumTask>(opts => opts.WithIdentity(sendUserVotingQuorumTask));
    q.AddTrigger(opts => opts
        .ForJob(sendUserVotingQuorumTask)
        .WithIdentity("SendUserVotingQuorumTask-trigger")
        .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(30)
                    .RepeatForever())
    );

});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);


var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

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
